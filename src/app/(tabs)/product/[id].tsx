import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from '@/components/ui/ProductCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/StateViews';
import { useAppState } from '@/context/AppStateContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { ProductSpecifications } from '@/types/product';
import { SPEC_LABELS } from '@/utils/filterProducts';
import { openProductEnquiry } from '@/utils/whatsapp';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width, isTablet, maxContentWidth, scaleFont } = useResponsive();
  const galleryHeight = isTablet ? Math.min(width * 0.52, 460) : width * 0.9;
  const {
    products,
    isWishlisted,
    toggleWishlist,
    isCompared,
    toggleCompare,
    addToEnquiry,
  } = useAppState();

  const product = useMemo(
    () => products.find((p) => p.id === id || p.slug === id),
    [products, id]
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomVisible, setZoomVisible] = useState(false);

  const selectedVariant = product?.variants[selectedVariantIdx];

  const mergedSpecs = useMemo(() => {
    if (!product) return [];
    const base = { ...product.specifications };
    if (selectedVariant) {
      (Object.keys(SPEC_LABELS) as (keyof ProductSpecifications)[]).forEach(
        (key) => {
          const val = selectedVariant[key];
          if (val) base[key] = val;
        }
      );
    }
    return (Object.keys(SPEC_LABELS) as (keyof ProductSpecifications)[])
      .map((key) => ({
        key,
        label: SPEC_LABELS[key],
        value: base[key],
      }))
      .filter((row): row is { key: keyof ProductSpecifications; label: string; value: string } =>
        Boolean(row.value)
      );
  }, [product, selectedVariant]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.brand === product.brand ||
            p.categories.some((c) => product.categories.includes(c)))
      )
      .slice(0, 6);
  }, [products, product]);

  if (!product) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Product" />
        <EmptyState
          icon="info"
          title="Product not found"
          message="This product may have been removed or is unavailable."
          actionLabel="Back to Catalogue"
          onAction={() => router.replace('/(tabs)/products')}
        />
      </View>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const compared = isCompared(product.id);

  const handleGalleryScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== activeImageIndex) setActiveImageIndex(idx);
  };

  const handleCompare = () => {
    const res = toggleCompare(product.id);
    if (res.limitReached) {
      Alert.alert(
        'Comparison Limit',
        'You can compare up to 4 products at a time.'
      );
    }
  };

  const handleAddToEnquiryList = () => {
    addToEnquiry(product, selectedVariant, quantity);
    Alert.alert(
      'Added to Enquiry List',
      `${product.productCode} (×${quantity}) has been added to your multi-product enquiry list in Wishlist.`
    );
  };

  const displayCategories = product.categories.filter(
    (c) =>
      c !== 'Cayman Newlight' &&
      c !== 'Hyundai Lighting' &&
      c !== 'Luceva'
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={product.productCode}
        subtitle={product.brand}
        rightElement={
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleCompare}
              hitSlop={10}
              accessibilityLabel="Compare product"
              style={styles.headerIconBtn}
            >
              <Icon
                name={compared ? 'check' : 'compare'}
                size={19}
                color={Palette.textPrimary}
              />
            </Pressable>
            <Pressable
              onPress={() => toggleWishlist(product.id)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              style={[
                styles.headerIconBtn,
                wishlisted && styles.headerIconBtnActive,
              ]}
            >
              <Icon
                name={wishlisted ? 'heart.fill' : 'heart'}
                size={20}
                color={wishlisted ? Palette.buttonPrimary : Palette.textSecondary}
              />
            </Pressable>
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 92 },
          isTablet && { alignItems: 'center' },
        ]}
      >
        <View style={isTablet ? { width: '100%', maxWidth: maxContentWidth } : { width: '100%' }}>
        {/* A. Product Image Gallery */}
        {(() => {
          const slideWidth = isTablet ? Math.min(width, maxContentWidth) : width;
          const imgWidth = Math.max(slideWidth - Spacing.lg * 2, 160);
          const imgHeight = Math.max(galleryHeight - Spacing.lg * 2, 160);
          return (
            <View style={[styles.galleryContainer, { width: slideWidth, height: galleryHeight }]}>
              {product.images.length > 0 ? (
                <>
                  <FlatList
                    data={product.images}
                    keyExtractor={(uri, idx) => `${uri}-${idx}`}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleGalleryScroll}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => setZoomVisible(true)}
                        style={[styles.slide, { width: slideWidth, height: galleryHeight }]}
                      >
                        <Image
                          source={{ uri: item }}
                          style={{ width: imgWidth, height: imgHeight }}
                          contentFit="contain"
                          transition={200}
                          cachePolicy="memory-disk"
                        />
                      </Pressable>
                    )}
                  />
                  {product.images.length > 1 && (
                    <View style={styles.pagination}>
                      {product.images.map((_, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.dot,
                            idx === activeImageIndex && styles.dotActive,
                          ]}
                        />
                      ))}
                    </View>
                  )}
                  <Pressable
                    onPress={() => setZoomVisible(true)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Zoom product image"
                    style={styles.zoomIconBtn}
                  >
                    <Icon name="search" size={18} color={Palette.textPrimary} />
                  </Pressable>
                </>
              ) : (
                <View style={styles.noImageBox}>
                  <Icon name="grid" size={36} color={Palette.disabled} />
                  <Text style={styles.noImageText}>No product image available</Text>
                </View>
              )}
            </View>
          );
        })()}

        {/* B. Product Info */}
        <View style={styles.section}>
          <Text style={[styles.brandLabel, { fontSize: scaleFont(11) }]}>
            {product.brand.toUpperCase()}
          </Text>
          <Text style={[styles.productTitle, { fontSize: scaleFont(26), lineHeight: scaleFont(32) }]}>
            {product.productName}
          </Text>
          <Text style={[styles.productCode, { fontSize: scaleFont(15) }]}>
            Model Code: {product.productCode}
          </Text>

          {displayCategories.length > 0 && (
            <View style={styles.tagRow}>
              {displayCategories.map((cat) => (
                <View key={cat} style={styles.tag}>
                  <Text style={styles.tagText}>{cat}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* C. Product Variants */}
        {product.variants.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Variants</Text>
            <View style={styles.variantList}>
              {product.variants.map((variant, idx) => {
                const selected = idx === selectedVariantIdx;
                const label =
                  variant.itemNo ??
                  [variant.power, variant.colorTemperature]
                    .filter(Boolean)
                    .join(' · ') ??
                  `Option ${idx + 1}`;
                const sub = [variant.power, variant.colorTemperature, variant.dimensions]
                  .filter(Boolean)
                  .join(' · ');
                return (
                  <Pressable
                    key={`${label}-${idx}`}
                    onPress={() => setSelectedVariantIdx(idx)}
                    style={[
                      styles.variantCard,
                      selected && styles.variantCardSelected,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.variantTitle,
                          selected && styles.variantTitleSelected,
                        ]}
                      >
                        {label}
                      </Text>
                      {sub ? (
                        <Text
                          style={[
                            styles.variantSub,
                            selected && styles.variantSubSelected,
                          ]}
                        >
                          {sub}
                        </Text>
                      ) : null}
                    </View>
                    {selected && (
                      <Icon name="check" size={16} color={Palette.buttonText} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Quantity & Secondary Actions */}
        <View style={styles.section}>
          <View style={styles.qtyRow}>
            <Text style={styles.sectionTitle}>Enquiry Quantity</Text>
            <View style={styles.qtyControls}>
              <Pressable
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                style={styles.qtyBtn}
                accessibilityLabel="Decrease quantity"
              >
                <Icon name="minus" size={16} color={Palette.textPrimary} />
              </Pressable>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <Pressable
                onPress={() => setQuantity((q) => q + 1)}
                style={styles.qtyBtn}
                accessibilityLabel="Increase quantity"
              >
                <Icon name="plus" size={16} color={Palette.textPrimary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.secondaryActionsRow}>
            <SecondaryButton
              label={wishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
              onPress={() => toggleWishlist(product.id)}
              style={{ flex: 1 }}
              leftIcon={
                <Icon
                  name={wishlisted ? 'heart.fill' : 'heart'}
                  size={16}
                  color={wishlisted ? Palette.buttonPrimary : Palette.textPrimary}
                />
              }
            />
            <SecondaryButton
              label="Add to Enquiry List"
              onPress={handleAddToEnquiryList}
              style={{ flex: 1 }}
              leftIcon={<Icon name="plus" size={16} color={Palette.textPrimary} />}
            />
          </View>
        </View>

        {/* D. Technical Specifications */}
        {mergedSpecs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Specifications</Text>
            <View style={styles.specTable}>
              {mergedSpecs.map((row, idx) => (
                <View
                  key={row.key}
                  style={[
                    styles.specRow,
                    idx === mergedSpecs.length - 1 && styles.specRowLast,
                  ]}
                >
                  <Text style={styles.specLabel}>{row.label}</Text>
                  <Text style={styles.specValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* E. Product Datasheet (only when datasheetUrl exists) */}
        {product.datasheetUrl ? (
          <View style={styles.section}>
            <SecondaryButton
              label="View Product Datasheet"
              onPress={() =>
                WebBrowser.openBrowserAsync(product.datasheetUrl!).catch(() => {})
              }
              leftIcon={<Icon name="doc" size={16} color={Palette.textPrimary} />}
            />
          </View>
        ) : null}

        {/* F. Related Products */}
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Products</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedList}
            >
              {relatedProducts.map((rel) => (
                <View key={rel.id} style={styles.relatedCardWrap}>
                  <ProductCard
                    product={rel}
                    isWishlisted={isWishlisted(rel.id)}
                    onPress={() => router.push(`/product/${rel.id}`)}
                    onToggleWishlist={() => toggleWishlist(rel.id)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        </View>
      </ScrollView>

      {/* G. Sticky Bottom WhatsApp Action */}
      <View style={styles.stickyFooter}>
        <View style={isTablet ? { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center' } : undefined}>
          <PrimaryButton
            label="Enquire via WhatsApp"
            onPress={() => openProductEnquiry(product, selectedVariant, quantity)}
            leftIcon={<Icon name="whatsapp" size={18} color={Palette.buttonText} />}
          />
        </View>
      </View>

      {/* Fullscreen Image Zoom Modal */}
      <Modal
        visible={zoomVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setZoomVisible(false)}
      >
        <View style={styles.zoomModal}>
          <Pressable
            onPress={() => setZoomVisible(false)}
            style={[styles.zoomClose, { top: insets.top + Spacing.sm }]}
            accessibilityLabel="Close full screen image"
          >
            <Icon name="close" size={22} color={Palette.buttonText} />
          </Pressable>
          {product.images[activeImageIndex] && (
            <Image
              source={{ uri: product.images[activeImageIndex] }}
              style={{ width, height: Math.min(width * 1.1, 680) }}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBtnActive: {
    backgroundColor: Palette.surfaceSecondary,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  galleryContainer: {
    backgroundColor: Palette.surfaceSecondary,
    position: 'relative',
  },
  slide: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: Spacing.md,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.borderStrong,
  },
  dotActive: {
    width: 18,
    backgroundColor: Palette.textPrimary,
  },
  zoomIconBtn: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: Radii.pill,
    backgroundColor: Palette.overlayLight,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  noImageText: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
  section: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  brandLabel: {
    ...Typography.micro,
    color: Palette.textSecondary,
    letterSpacing: 1,
  },
  productTitle: {
    ...Typography.h1,
    color: Palette.textPrimary,
  },
  productCode: {
    ...Typography.body,
    color: Palette.textSecondary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 4,
  },
  tag: {
    backgroundColor: Palette.surfaceSecondary,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.pill,
  },
  tagText: {
    ...Typography.micro,
    color: Palette.textPrimary,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Palette.textPrimary,
  },
  variantList: {
    gap: Spacing.xs,
  },
  variantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    backgroundColor: Palette.background,
    gap: Spacing.sm,
  },
  variantCardSelected: {
    backgroundColor: Palette.buttonPrimary,
    borderColor: Palette.buttonPrimary,
  },
  variantTitle: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  variantTitleSelected: {
    color: Palette.buttonText,
  },
  variantSub: {
    ...Typography.caption,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  variantSubSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: Radii.xs,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    ...Typography.h3,
    color: Palette.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  specTable: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radii.sm,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
    gap: Spacing.md,
  },
  specRowLast: {
    borderBottomWidth: 0,
  },
  specLabel: {
    ...Typography.captionMedium,
    color: Palette.textSecondary,
    flex: 1,
  },
  specValue: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
    flex: 1.2,
    textAlign: 'right',
  },
  relatedSection: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  relatedTitle: {
    ...Typography.h2,
    color: Palette.textPrimary,
    paddingHorizontal: Spacing.md,
  },
  relatedList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  relatedCardWrap: {
    width: 168,
  },
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Palette.background,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  zoomModal: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomClose: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
