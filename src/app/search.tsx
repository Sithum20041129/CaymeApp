import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from '@/components/ui/ProductCard';
import { EmptyState } from '@/components/ui/StateViews';
import { useAppState } from '@/context/AppStateContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { EMPTY_FILTERS } from '@/types/product';
import { filterAndSortProducts } from '@/utils/filterProducts';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { numColumns, isTablet, maxContentWidth } = useResponsive();
  const cardWidth =
    numColumns === 4 ? '23.8%' : numColumns === 3 ? '32%' : '48.5%';
  const {
    products,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    isWishlisted,
    toggleWishlist,
  } = useAppState();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return filterAndSortProducts(products, EMPTY_FILTERS, query, 'newest');
  }, [products, query]);

  const handleSubmit = () => {
    if (query.trim()) addRecentSearch(query);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityLabel="Back"
          style={styles.backBtn}
        >
          <Icon name="back" size={22} color={Palette.textPrimary} />
        </Pressable>

        <View style={styles.searchBar}>
          <Icon name="search" size={17} color={Palette.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            placeholder="Search code, product, brand, wattage..."
            placeholderTextColor={Palette.textMuted}
            style={styles.input}
            autoFocus
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Icon name="close" size={16} color={Palette.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {!query.trim() ? (
        <View style={styles.body}>
          {recentSearches.length > 0 ? (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>Recent Searches</Text>
                <Pressable onPress={clearRecentSearches} hitSlop={8}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              </View>
              <View style={styles.recentList}>
                {recentSearches.map((term) => (
                  <Pressable
                    key={term}
                    onPress={() => setQuery(term)}
                    style={styles.recentChip}
                  >
                    <Icon
                      name="search"
                      size={13}
                      color={Palette.textSecondary}
                    />
                    <Text style={styles.recentChipText}>{term}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          <EmptyState
            icon="search"
            title="Search Cayman Lighting"
            message="Find fixtures by product code (e.g. PD-P92059), brand, category, or technical specification."
          />
        </View>
      ) : results.length === 0 ? (
        <EmptyState
          icon="search"
          title="No products found"
          message={`No results matched "${query.trim()}". Try a different product code or category.`}
          actionLabel="Clear Search"
          onAction={() => setQuery('')}
        />
      ) : (
        <FlatList
          key={`search-grid-${numColumns}`}
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={[
            styles.listContent,
            isTablet && { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
          ]}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={{ width: cardWidth }}>
              <ProductCard
                product={item}
                isWishlisted={isWishlisted(item.id)}
                onPress={() => {
                  addRecentSearch(query);
                  router.push(`/product/${item.id}`);
                }}
                onToggleWishlist={() => toggleWishlist(item.id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  backBtn: {
    width: 34,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  searchBar: {
    flex: 1,
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
  input: {
    flex: 1,
    ...Typography.body,
    color: Palette.textPrimary,
    paddingVertical: 0,
  },
  body: {
    flex: 1,
  },
  recentSection: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTitle: {
    ...Typography.captionMedium,
    color: Palette.textSecondary,
  },
  clearText: {
    ...Typography.caption,
    color: Palette.textSecondary,
    textDecorationLine: 'underline',
  },
  recentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
  },
  recentChipText: {
    ...Typography.caption,
    color: Palette.textPrimary,
  },
  resultCount: {
    ...Typography.caption,
    color: Palette.textSecondary,
    marginBottom: Spacing.sm,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cardWrap: {
    width: '48.5%',
  },
});
