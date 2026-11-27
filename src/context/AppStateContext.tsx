import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { MAIN_CATEGORIES, SEED_PRODUCTS } from '@/data/catalog';
import {
  fetchCategoryImages,
  loadCachedCatalogue,
  syncLiveCatalogue,
} from '@/services/catalogService';
import {
  CatalogProduct,
  CategoryItem,
  EMPTY_FILTERS,
  EnquiryItem,
  FilterState,
  ProductVariant,
  SortOption,
} from '@/types/product';
import { productMatchesCategory } from '@/utils/filterProducts';

const WISHLIST_KEY = '@cayman_wishlist_v1';
const COMPARE_KEY = '@cayman_compare_v1';
const ENQUIRY_KEY = '@cayman_enquiry_v1';
const RECENT_SEARCH_KEY = '@cayman_recent_searches_v1';

interface AppStateContextValue {
  products: CatalogProduct[];
  categories: CategoryItem[];
  isLoadingCatalogue: boolean;
  isOfflineFallback: boolean;
  refreshCatalogue: () => Promise<void>;

  wishlistIds: string[];
  wishlistProducts: CatalogProduct[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;

  compareIds: string[];
  compareProducts: CatalogProduct[];
  isCompared: (productId: string) => boolean;
  toggleCompare: (productId: string) => { added: boolean; limitReached?: boolean };
  removeCompare: (productId: string) => void;
  clearCompare: () => void;

  enquiryItems: EnquiryItem[];
  addToEnquiry: (
    product: CatalogProduct,
    selectedVariant?: ProductVariant,
    quantity?: number
  ) => void;
  removeFromEnquiry: (productId: string, itemNo?: string) => void;
  updateEnquiryQty: (productId: string, itemNo: string | undefined, delta: number) => void;
  clearEnquiry: () => void;

  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<CatalogProduct[]>(SEED_PRODUCTS);
  const [categoryImageMap, setCategoryImageMap] = useState<Record<string, string>>({});
  const [isLoadingCatalogue, setIsLoadingCatalogue] = useState(true);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [enquiryItems, setEnquiryItems] = useState<EnquiryItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const [cachedProds, wishRaw, compRaw, enqRaw, searchRaw] =
          await Promise.all([
            loadCachedCatalogue(),
            AsyncStorage.getItem(WISHLIST_KEY),
            AsyncStorage.getItem(COMPARE_KEY),
            AsyncStorage.getItem(ENQUIRY_KEY),
            AsyncStorage.getItem(RECENT_SEARCH_KEY),
          ]);

        if (!mounted) return;
        setProducts(cachedProds);
        if (wishRaw) setWishlistIds(JSON.parse(wishRaw));
        if (compRaw) setCompareIds(JSON.parse(compRaw));
        if (enqRaw) setEnquiryItems(JSON.parse(enqRaw));
        if (searchRaw) setRecentSearches(JSON.parse(searchRaw));
      } catch {
        // Ignore hydration errors and keep defaults
      } finally {
        if (mounted) setIsLoadingCatalogue(false);
      }

      const [synced, liveCategoryImages] = await Promise.all([
        syncLiveCatalogue(),
        fetchCategoryImages(),
      ]);
      if (mounted) {
        setProducts(synced.products);
        setIsOfflineFallback(!synced.fromNetwork);
        if (Object.keys(liveCategoryImages).length > 0) {
          setCategoryImageMap(liveCategoryImages);
        }
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshCatalogue = useCallback(async () => {
    setIsLoadingCatalogue(true);
    const [synced, liveCategoryImages] = await Promise.all([
      syncLiveCatalogue(),
      fetchCategoryImages(),
    ]);
    setProducts(synced.products);
    setIsOfflineFallback(!synced.fromNetwork);
    if (Object.keys(liveCategoryImages).length > 0) {
      setCategoryImageMap(liveCategoryImages);
    }
    setIsLoadingCatalogue(false);
  }, []);

  const categories = useMemo<CategoryItem[]>(
    () =>
      MAIN_CATEGORIES.map((cat) => {
        const fromApi = categoryImageMap[cat.slug];
        const fromProduct = products.find(
          (p) => productMatchesCategory(p, cat.name) && p.images[0]
        )?.images[0];
        return {
          ...cat,
          imageUrl: fromApi || cat.imageUrl || fromProduct,
        };
      }),
    [categoryImageMap, products]
  );

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists
        ? prev.filter((id) => id !== productId)
        : [productId, ...prev];
      AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    AsyncStorage.removeItem(WISHLIST_KEY).catch(() => {});
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const wishlistProducts = useMemo(
    () =>
      wishlistIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is CatalogProduct => Boolean(p)),
    [wishlistIds, products]
  );

  const toggleCompare = useCallback(
    (productId: string): { added: boolean; limitReached?: boolean } => {
      if (compareIds.includes(productId)) {
        const next = compareIds.filter((id) => id !== productId);
        setCompareIds(next);
        AsyncStorage.setItem(COMPARE_KEY, JSON.stringify(next)).catch(() => {});
        return { added: false };
      }
      if (compareIds.length >= 4) {
        return { added: false, limitReached: true };
      }
      const next = [...compareIds, productId];
      setCompareIds(next);
      AsyncStorage.setItem(COMPARE_KEY, JSON.stringify(next)).catch(() => {});
      return { added: true };
    },
    [compareIds]
  );

  const removeCompare = useCallback((productId: string) => {
    setCompareIds((prev) => {
      const next = prev.filter((id) => id !== productId);
      AsyncStorage.setItem(COMPARE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    AsyncStorage.removeItem(COMPARE_KEY).catch(() => {});
  }, []);

  const isCompared = useCallback(
    (productId: string) => compareIds.includes(productId),
    [compareIds]
  );

  const compareProducts = useMemo(
    () =>
      compareIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is CatalogProduct => Boolean(p)),
    [compareIds, products]
  );

  const addToEnquiry = useCallback(
    (
      product: CatalogProduct,
      selectedVariant?: ProductVariant,
      quantity = 1
    ) => {
      setEnquiryItems((prev) => {
        const itemNo = selectedVariant?.itemNo;
        const idx = prev.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedVariant?.itemNo === itemNo
        );
        let next: EnquiryItem[];
        if (idx >= 0) {
          next = prev.map((item, i) =>
            i === idx ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          next = [...prev, { product, selectedVariant, quantity }];
        }
        AsyncStorage.setItem(ENQUIRY_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const removeFromEnquiry = useCallback(
    (productId: string, itemNo?: string) => {
      setEnquiryItems((prev) => {
        const next = prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.selectedVariant?.itemNo === itemNo
            )
        );
        AsyncStorage.setItem(ENQUIRY_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const updateEnquiryQty = useCallback(
    (productId: string, itemNo: string | undefined, delta: number) => {
      setEnquiryItems((prev) => {
        const next = prev
          .map((item) => {
            if (
              item.product.id === productId &&
              item.selectedVariant?.itemNo === itemNo
            ) {
              return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);
        AsyncStorage.setItem(ENQUIRY_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const clearEnquiry = useCallback(() => {
    setEnquiryItems([]);
    AsyncStorage.removeItem(ENQUIRY_KEY).catch(() => {});
  }, []);

  const addRecentSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const next = [clean, ...prev.filter((t) => t !== clean)].slice(0, 8);
      AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next)).catch(
        () => {}
      );
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    AsyncStorage.removeItem(RECENT_SEARCH_KEY).catch(() => {});
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      products,
      categories,
      isLoadingCatalogue,
      isOfflineFallback,
      refreshCatalogue,
      wishlistIds,
      wishlistProducts,
      isWishlisted,
      toggleWishlist,
      clearWishlist,
      compareIds,
      compareProducts,
      isCompared,
      toggleCompare,
      removeCompare,
      clearCompare,
      enquiryItems,
      addToEnquiry,
      removeFromEnquiry,
      updateEnquiryQty,
      clearEnquiry,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      filters,
      setFilters,
      resetFilters,
      sortBy,
      setSortBy,
    }),
    [
      products,
      categories,
      isLoadingCatalogue,
      isOfflineFallback,
      refreshCatalogue,
      wishlistIds,
      wishlistProducts,
      isWishlisted,
      toggleWishlist,
      clearWishlist,
      compareIds,
      compareProducts,
      isCompared,
      toggleCompare,
      removeCompare,
      clearCompare,
      enquiryItems,
      addToEnquiry,
      removeFromEnquiry,
      updateEnquiryQty,
      clearEnquiry,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      filters,
      resetFilters,
      sortBy,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return ctx;
}
