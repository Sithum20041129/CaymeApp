import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { useResponsive } from '@/hooks/useResponsive';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { CatalogProduct } from '@/types/product';

interface ProductCardProps {
  product: CatalogProduct;
  isWishlisted: boolean;
  onPress: () => void;
  onToggleWishlist: () => void;
  isCompared?: boolean;
  onToggleCompare?: () => void;
  style?: ViewStyle;
}

function getPrimaryCategoryLabel(product: CatalogProduct): string | null {
  const nonBrand = product.categories.find(
    (c) =>
      c !== 'Cayman Newlight' &&
      c !== 'Hyundai Lighting' &&
      c !== 'Luceva'
  );
  return nonBrand ?? null;
}

export const ProductCard = React.memo(function ProductCard({
  product,
  isWishlisted,
  onPress,
  onToggleWishlist,
  isCompared = false,
  onToggleCompare,
  style,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { scaleFont } = useResponsive();
  const imageUri = product.images[0];
  const categoryLabel = getPrimaryCategoryLabel(product);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.imageBox}>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${product.productName}, ${product.brand}`}
          style={({ pressed }) => [styles.imagePress, pressed && styles.pressed]}
        >
          {imageUri && !imageError ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              contentFit="contain"
              transition={180}
              cachePolicy="memory-disk"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.imageFallback}>
              <Icon name="grid" size={24} color={Palette.disabled} />
              <Text style={styles.fallbackText}>No Image</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={onToggleWishlist}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={
            isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
          }
          style={[
            styles.wishlistBtn,
            isWishlisted && styles.wishlistBtnActive,
          ]}
        >
          <Icon
            name={isWishlisted ? 'heart.fill' : 'heart'}
            size={18}
            color={isWishlisted ? Palette.buttonPrimary : Palette.textSecondary}
          />
        </Pressable>

        {onToggleCompare && (
          <Pressable
            onPress={onToggleCompare}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              isCompared ? 'Remove from comparison' : 'Add to comparison'
            }
            style={[
              styles.compareBtn,
              isCompared && styles.compareBtnActive,
            ]}
          >
            <Icon
              name={isCompared ? 'check' : 'compare'}
              size={13}
              color={isCompared ? Palette.buttonText : Palette.textSecondary}
            />
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`View ${product.productName}`}
        style={({ pressed }) => [styles.meta, pressed && styles.pressed]}
      >
        <Text
          style={[styles.brand, { fontSize: scaleFont(11) }]}
          numberOfLines={1}
        >
          {product.brand.toUpperCase()}
        </Text>
        <Text
          style={[styles.title, { fontSize: scaleFont(15) }]}
          numberOfLines={1}
        >
          {product.productName}
        </Text>
        <View style={styles.bottomRow}>
          <Text
            style={[styles.code, { fontSize: scaleFont(13) }]}
            numberOfLines={1}
          >
            {product.specifications.power
              ? product.specifications.power
              : product.productCode}
          </Text>
          {categoryLabel && (
            <Text style={styles.categoryTag} numberOfLines={1}>
              {categoryLabel}
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Palette.background,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Palette.surfaceSecondary,
    position: 'relative',
  },
  imagePress: {
    width: '100%',
    height: '100%',
    padding: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  fallbackText: {
    ...Typography.micro,
    color: Palette.textSecondary,
  },
  wishlistBtn: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 34,
    height: 34,
    borderRadius: Radii.pill,
    backgroundColor: Palette.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  wishlistBtnActive: {
    borderColor: Palette.buttonPrimary,
    backgroundColor: Palette.background,
  },
  compareBtn: {
    position: 'absolute',
    bottom: Spacing.xs,
    right: Spacing.xs,
    width: 26,
    height: 26,
    borderRadius: Radii.pill,
    backgroundColor: Palette.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  compareBtnActive: {
    backgroundColor: Palette.buttonPrimary,
    borderColor: Palette.buttonPrimary,
  },
  meta: {
    padding: Spacing.sm,
    gap: 3,
  },
  brand: {
    ...Typography.micro,
    color: Palette.textSecondary,
  },
  title: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    marginTop: 2,
  },
  code: {
    ...Typography.caption,
    color: Palette.textSecondary,
    flexShrink: 0,
  },
  categoryTag: {
    ...Typography.micro,
    color: Palette.textMuted,
    flexShrink: 1,
    textAlign: 'right',
  },
});
