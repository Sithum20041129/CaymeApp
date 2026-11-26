import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/StateViews';
import { useAppState } from '@/context/AppStateContext';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { CatalogProduct } from '@/types/product';
import {
  openMultipleProductEnquiry,
  openProductEnquiry,
} from '@/utils/whatsapp';

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const {
    wishlistProducts,
    toggleWishlist,
    enquiryItems,
    addToEnquiry,
    updateEnquiryQty,
    removeFromEnquiry,
    clearEnquiry,
    compareProducts,
  } = useAppState();

  const renderWishlistItem = ({ item }: { item: CatalogProduct }) => (
    <View style={styles.card}>
      <Pressable
        onPress={() => router.push(`/product/${item.id}`)}
        style={({ pressed }) => [styles.imageBox, pressed && styles.pressed]}
      >
        {item.images[0] ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        ) : (
          <Icon name="grid" size={20} color={Palette.disabled} />
        )}
      </Pressable>

      <View style={styles.info}>
        <Pressable onPress={() => router.push(`/product/${item.id}`)}>
          <Text style={styles.brand}>{item.brand.toUpperCase()}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {item.productName}
          </Text>
          <Text style={styles.code} numberOfLines={1}>
            Code: {item.productCode}
            {item.specifications.power ? ` · ${item.specifications.power}` : ''}
          </Text>
        </Pressable>

        <View style={styles.cardActions}>
          <Pressable
            onPress={() => openProductEnquiry(item, item.variants[0], 1)}
            style={styles.whatsappPill}
          >
            <Icon name="whatsapp" size={13} color={Palette.buttonText} />
            <Text style={styles.whatsappPillText}>Enquire</Text>
          </Pressable>

          <Pressable
            onPress={() => addToEnquiry(item, item.variants[0], 1)}
            style={styles.outlinePill}
          >
            <Icon name="plus" size={13} color={Palette.textPrimary} />
            <Text style={styles.outlinePillText}>Add to List</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => toggleWishlist(item.id)}
        hitSlop={10}
        accessibilityLabel="Remove from wishlist"
        style={styles.removeBtn}
      >
        <Icon name="close" size={16} color={Palette.textSecondary} />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Wishlist</Text>
            <Text style={styles.subtitle}>
              {wishlistProducts.length} saved{' '}
              {wishlistProducts.length === 1 ? 'product' : 'products'}
            </Text>
          </View>
          {compareProducts.length > 0 && (
            <Pressable
              onPress={() => router.push('/compare')}
              style={styles.compareBtn}
            >
              <Icon name="compare" size={15} color={Palette.textPrimary} />
              <Text style={styles.compareBtnText}>
                Compare ({compareProducts.length})
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {wishlistProducts.length === 0 && enquiryItems.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Your wishlist is empty"
          message="Save lighting fixtures while browsing to compare specifications or send a WhatsApp enquiry."
          actionLabel="Browse Products"
          onAction={() => router.push('/(tabs)/products')}
        />
      ) : (
        <FlatList
          data={wishlistProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderWishlistItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            enquiryItems.length > 0 ? (
              <View style={styles.enquirySection}>
                <View style={styles.enquiryHeader}>
                  <View>
                    <Text style={styles.enquiryTitle}>
                      Multi-Product Enquiry List
                    </Text>
                    <Text style={styles.enquirySub}>
                      Send a combined product enquiry via WhatsApp
                    </Text>
                  </View>
                  <Pressable onPress={clearEnquiry} hitSlop={8}>
                    <Text style={styles.clearText}>Clear</Text>
                  </Pressable>
                </View>

                {enquiryItems.map((entry) => (
                  <View
                    key={`${entry.product.id}-${entry.selectedVariant?.itemNo ?? 'base'}`}
                    style={styles.enquiryRow}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.enquiryName}>
                        {entry.product.productCode}
                      </Text>
                      <Text style={styles.enquiryMeta}>
                        {entry.product.brand}
                        {entry.selectedVariant?.itemNo
                          ? ` · ${entry.selectedVariant.itemNo}`
                          : ''}
                      </Text>
                    </View>

                    <View style={styles.qtyControls}>
                      <Pressable
                        onPress={() =>
                          updateEnquiryQty(
                            entry.product.id,
                            entry.selectedVariant?.itemNo,
                            -1
                          )
                        }
                        style={styles.qtyBtn}
                      >
                        <Icon name="minus" size={14} color={Palette.textPrimary} />
                      </Pressable>
                      <Text style={styles.qtyText}>{entry.quantity}</Text>
                      <Pressable
                        onPress={() =>
                          updateEnquiryQty(
                            entry.product.id,
                            entry.selectedVariant?.itemNo,
                            1
                          )
                        }
                        style={styles.qtyBtn}
                      >
                        <Icon name="plus" size={14} color={Palette.textPrimary} />
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          removeFromEnquiry(
                            entry.product.id,
                            entry.selectedVariant?.itemNo
                          )
                        }
                        hitSlop={8}
                        style={{ marginLeft: 4 }}
                      >
                        <Icon name="trash" size={16} color={Palette.textSecondary} />
                      </Pressable>
                    </View>
                  </View>
                ))}

                <PrimaryButton
                  label={`Send Enquiry (${enquiryItems.length} ${
                    enquiryItems.length === 1 ? 'Item' : 'Items'
                  }) via WhatsApp`}
                  onPress={() => openMultipleProductEnquiry(enquiryItems)}
                  leftIcon={
                    <Icon name="whatsapp" size={17} color={Palette.buttonText} />
                  }
                  style={{ marginTop: Spacing.sm }}
                />
              </View>
            ) : undefined
          }
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
    backgroundColor: Palette.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.h1,
    color: Palette.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
  },
  compareBtnText: {
    ...Typography.captionMedium,
    color: Palette.textPrimary,
  },
  list: {
    padding: Spacing.md,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Palette.background,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: Spacing.sm,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  imageBox: {
    width: 84,
    height: 84,
    borderRadius: Radii.xs,
    backgroundColor: Palette.surfaceSecondary,
    padding: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  brand: {
    ...Typography.micro,
    color: Palette.textSecondary,
  },
  name: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  code: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 6,
  },
  whatsappPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.buttonPrimary,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.xs,
  },
  whatsappPillText: {
    ...Typography.captionMedium,
    color: Palette.buttonText,
  },
  outlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.xs,
  },
  outlinePillText: {
    ...Typography.captionMedium,
    color: Palette.textPrimary,
  },
  removeBtn: {
    alignSelf: 'flex-start',
    padding: 4,
  },
  enquirySection: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.sm,
  },
  enquiryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  enquiryTitle: {
    ...Typography.h3,
    color: Palette.textPrimary,
  },
  enquirySub: {
    ...Typography.caption,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  clearText: {
    ...Typography.captionMedium,
    color: Palette.textSecondary,
    textDecorationLine: 'underline',
  },
  enquiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    gap: Spacing.sm,
  },
  enquiryName: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  enquiryMeta: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: Radii.xs,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
});
