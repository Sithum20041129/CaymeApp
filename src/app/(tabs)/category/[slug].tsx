import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '@/components/ui/ProductCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/StateViews';
import { useAppState } from '@/context/AppStateContext';
import { MAIN_CATEGORIES } from '@/data/catalog';
import { useResponsive } from '@/hooks/useResponsive';
import { Palette, Spacing, Typography } from '@/theme/tokens';
import { productMatchesCategory } from '@/utils/filterProducts';

export default function CategoryScreen() {
  const { slug, name } = useLocalSearchParams<{ slug: string; name?: string }>();
  const { numColumns, isTablet, maxContentWidth } = useResponsive();
  const { products, isWishlisted, toggleWishlist } = useAppState();
  const cardWidth =
    numColumns === 4 ? '23.8%' : numColumns === 3 ? '32%' : '48.5%';

  const categoryInfo = useMemo(
    () => MAIN_CATEGORIES.find((c) => c.slug === slug),
    [slug]
  );

  const displayName = name || categoryInfo?.name || slug || 'Category';

  const items = useMemo(
    () =>
      products.filter(
        (p) =>
          productMatchesCategory(p, displayName) ||
          (slug ? productMatchesCategory(p, slug.replace(/-/g, ' ')) : false)
      ),
    [products, displayName, slug]
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={displayName}
        subtitle={`${items.length} ${items.length === 1 ? 'product' : 'products'}`}
      />

      {items.length === 0 ? (
        <EmptyState
          icon="grid"
          title="No products in this category"
          message="Browse the full catalogue or try another lighting category."
          actionLabel="View All Products"
          onAction={() => router.replace('/(tabs)/products')}
        />
      ) : (
        <FlatList
          key={`cat-grid-${numColumns}`}
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={[
            styles.listContent,
            isTablet && { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
          ]}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            categoryInfo?.description ? (
              <Text style={styles.description}>{categoryInfo.description}</Text>
            ) : undefined
          }
          renderItem={({ item }) => (
            <View style={{ width: cardWidth }}>
              <ProductCard
                product={item}
                isWishlisted={isWishlisted(item.id)}
                onPress={() => router.push(`/product/${item.id}`)}
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
  description: {
    ...Typography.body,
    color: Palette.textSecondary,
    marginBottom: Spacing.md,
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
