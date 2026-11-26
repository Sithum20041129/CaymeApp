import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from '@/components/ui/ProductCard';
import {
  EmptyState,
  LoadingGrid,
  OfflineBanner,
} from '@/components/ui/StateViews';
import { useAppState } from '@/context/AppStateContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { BrandName, CatalogProduct, SortOption } from '@/types/product';
import {
  countActiveFilters,
  filterAndSortProducts,
} from '@/utils/filterProducts';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const { numColumns, isTablet, maxContentWidth, scaleFont } = useResponsive();
  const {
    products,
    isLoadingCatalogue,
    isOfflineFallback,
    refreshCatalogue,
    filters,
    setFilters,
    resetFilters,
    sortBy,
    setSortBy,
    isWishlisted,
    toggleWishlist,
    isCompared,
    toggleCompare,
    compareProducts,
  } = useAppState();

  const [searchText, setSearchText] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters, searchText, sortBy),
    [products, filters, searchText, sortBy]
  );

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters),
    [filters]
  );

  const handleToggleCompare = useCallback(
    (productId: string) => {
      const res = toggleCompare(productId);
      if (res.limitReached) {
        Alert.alert(
          'Comparison Limit',
          'You can compare up to 4 products at a time.'
        );
      }
    },
    [toggleCompare]
  );

  const removeChip = useCallback(
    (
      group:
        | 'categories'
        | 'brands'
        | 'productTypes'
        | 'powers'
        | 'colorTemperatures'
        | 'voltages',
      value: string
    ) => {
      setFilters((prev) => ({
        ...prev,
        [group]:
          group === 'brands'
            ? prev.brands.filter((b) => b !== (value as BrandName))
            : (prev[group] as string[]).filter((item) => item !== value),
      }));
    },
    [setFilters]
  );

  const activeChips = useMemo(() => {
    const chips: {
      group:
        | 'categories'
        | 'brands'
        | 'productTypes'
        | 'powers'
        | 'colorTemperatures'
        | 'voltages';
      value: string;
    }[] = [];
    filters.brands.forEach((v) => chips.push({ group: 'brands', value: v }));
    filters.categories.forEach((v) =>
      chips.push({ group: 'categories', value: v })
    );
    filters.productTypes.forEach((v) =>
      chips.push({ group: 'productTypes', value: v })
    );
    filters.powers.forEach((v) => chips.push({ group: 'powers', value: v }));
    filters.colorTemperatures.forEach((v) =>
      chips.push({ group: 'colorTemperatures', value: v })
    );
    filters.voltages.forEach((v) =>
      chips.push({ group: 'voltages', value: v })
    );
    return chips;
  }, [filters]);

  const cardWidth =
    numColumns === 4 ? '23.8%' : numColumns === 3 ? '32%' : '48.5%';

  const renderItem = useCallback(
    ({ item }: { item: CatalogProduct }) => (
      <View style={{ width: cardWidth }}>
        <ProductCard
          product={item}
          isWishlisted={isWishlisted(item.id)}
          onPress={() => router.push(`/product/${item.id}`)}
          onToggleWishlist={() => toggleWishlist(item.id)}
          isCompared={isCompared(item.id)}
          onToggleCompare={() => handleToggleCompare(item.id)}
        />
      </View>
    ),
    [cardWidth, isWishlisted, toggleWishlist, isCompared, handleToggleCompare]
  );

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Newest';

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { fontSize: scaleFont(26) }]}>Products</Text>
          <Text style={[styles.countText, { fontSize: scaleFont(13) }]}>
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <Icon name="search" size={17} color={Palette.textSecondary} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by code, name, brand or wattage"
            placeholderTextColor={Palette.textMuted}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchText.length > 0 && (
            <Pressable
              onPress={() => setSearchText('')}
              hitSlop={8}
              accessibilityLabel="Clear search"
            >
              <Icon name="close" size={16} color={Palette.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Filter & Sort Controls */}
        <View style={styles.controlsRow}>
          <Pressable
            onPress={() => router.push('/filters')}
            style={({ pressed }) => [
              styles.controlBtn,
              activeFilterCount > 0 && styles.controlBtnActive,
              pressed && styles.pressed,
            ]}
          >
            <Icon
              name="filter"
              size={15}
              color={
                activeFilterCount > 0
                  ? Palette.buttonText
                  : Palette.textPrimary
              }
            />
            <Text
              style={[
                styles.controlBtnText,
                activeFilterCount > 0 && styles.controlBtnTextActive,
              ]}
            >
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSortModalVisible(true)}
            style={({ pressed }) => [
              styles.controlBtn,
              pressed && styles.pressed,
            ]}
          >
            <Icon name="sort" size={15} color={Palette.textPrimary} />
            <Text style={styles.controlBtnText}>Sort: {currentSortLabel}</Text>
          </Pressable>

          {compareProducts.length > 0 && (
            <Pressable
              onPress={() => router.push('/compare')}
              style={({ pressed }) => [
                styles.controlBtn,
                styles.controlBtnActive,
                pressed && styles.pressed,
              ]}
            >
              <Icon name="compare" size={15} color={Palette.buttonText} />
              <Text style={styles.controlBtnTextActive}>
                Compare ({compareProducts.length})
              </Text>
            </Pressable>
          )}
        </View>

        {/* Removable Active Filter Chips */}
        {activeChips.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {activeChips.map((chip) => (
              <Pressable
                key={`${chip.group}-${chip.value}`}
                onPress={() => removeChip(chip.group, chip.value)}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{chip.value}</Text>
                <Icon name="close" size={12} color={Palette.textSecondary} />
              </Pressable>
            ))}
            <Pressable onPress={resetFilters} style={styles.clearChip}>
              <Text style={styles.clearChipText}>Clear all</Text>
            </Pressable>
          </ScrollView>
        )}
      </View>

      {isOfflineFallback && <OfflineBanner />}

      {/* Product Grid */}
      {isLoadingCatalogue && products.length === 0 ? (
        <LoadingGrid count={6} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon="search"
          title="No matching products"
          message="Try adjusting your search query or clearing some active filters."
          actionLabel={
            activeFilterCount > 0 || searchText ? 'Reset Filters' : undefined
          }
          onAction={() => {
            resetFilters();
            setSearchText('');
          }}
        />
      ) : (
        <FlatList
          key={`products-grid-${numColumns}`}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          contentContainerStyle={[
            styles.listContent,
            isTablet && { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
          ]}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshing={isLoadingCatalogue}
          onRefresh={refreshCatalogue}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
        />
      )}

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Sort Products</Text>
            {SORT_OPTIONS.map((opt) => {
              const selected = sortBy === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    setSortBy(opt.value);
                    setSortModalVisible(false);
                  }}
                  style={styles.sortOption}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      selected && styles.sortOptionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {selected && (
                    <Icon name="check" size={18} color={Palette.textPrimary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    backgroundColor: Palette.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.h1,
    color: Palette.textPrimary,
  },
  countText: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: Spacing.sm,
    height: 42,
    gap: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Palette.textPrimary,
    paddingVertical: 0,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    backgroundColor: Palette.background,
  },
  controlBtnActive: {
    backgroundColor: Palette.buttonPrimary,
    borderColor: Palette.buttonPrimary,
  },
  controlBtnText: {
    ...Typography.captionMedium,
    color: Palette.textPrimary,
  },
  controlBtnTextActive: {
    ...Typography.captionMedium,
    color: Palette.buttonText,
  },
  chipsRow: {
    gap: Spacing.xs,
    paddingTop: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm,
  },
  chipText: {
    ...Typography.caption,
    color: Palette.textPrimary,
  },
  clearChip: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  clearChipText: {
    ...Typography.captionMedium,
    color: Palette.textSecondary,
    textDecorationLine: 'underline',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cardWrapper: {
    width: '48.5%',
  },
  leftCard: {},
  rightCard: {},
  pressed: {
    opacity: 0.78,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: Palette.overlayDark,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Palette.background,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xs,
  },
  modalTitle: {
    ...Typography.h3,
    color: Palette.textPrimary,
    marginBottom: Spacing.xs,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  sortOptionText: {
    ...Typography.body,
    color: Palette.textSecondary,
  },
  sortOptionTextActive: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
});
