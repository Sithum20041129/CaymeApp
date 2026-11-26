import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '@/components/ui/ProductCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/StateViews';
import { useAppState } from '@/context/AppStateContext';
import { BRANDS } from '@/data/catalog';
import { useResponsive } from '@/hooks/useResponsive';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';

export default function BrandScreen() {
  const { slug, name } = useLocalSearchParams<{ slug: string; name?: string }>();
  const { numColumns, isTablet, maxContentWidth } = useResponsive();
  const { products, isWishlisted, toggleWishlist } = useAppState();
  const cardWidth =
    numColumns === 4 ? '23.8%' : numColumns === 3 ? '32%' : '48.5%';

  const brandInfo = useMemo(
    () =>
      BRANDS.find(
        (b) =>
          b.slug === slug ||
          b.name.toLowerCase() === (name ?? '').toLowerCase()
      ),
    [slug, name]
  );

  const brandName = brandInfo?.name ?? name ?? 'Brand';

  const items = useMemo(
    () =>
      products.filter(
        (p) => p.brand.toLowerCase() === brandName.toLowerCase()
      ),
    [products, brandName]
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={brandName}
        subtitle={`${items.length} ${items.length === 1 ? 'product' : 'products'}`}
      />

      {items.length === 0 ? (
        <EmptyState
          icon="grid"
          title="No products found"
          message="Explore our full product catalogue."
          actionLabel="All Products"
          onAction={() => router.replace('/(tabs)/products')}
        />
      ) : (
        <FlatList
          key={`brand-grid-${numColumns}`}
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
            brandInfo ? (
              <View style={styles.brandHeader}>
                {brandInfo.logoUrl ? (
                  <Image
                    source={{ uri: brandInfo.logoUrl }}
                    style={styles.logo}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                ) : null}
                <Text style={styles.tagline}>{brandInfo.tagline}</Text>
              </View>
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
  brandHeader: {
    padding: Spacing.md,
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  logo: {
    width: 88,
    height: 28,
  },
  tagline: {
    ...Typography.body,
    color: Palette.textSecondary,
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
