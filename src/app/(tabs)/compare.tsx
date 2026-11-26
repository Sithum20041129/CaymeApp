import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/StateViews';
import { useAppState } from '@/context/AppStateContext';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { ProductSpecifications } from '@/types/product';
import { SPEC_LABELS } from '@/utils/filterProducts';
import { openProductEnquiry } from '@/utils/whatsapp';

const COL_WIDTH = 156;
const LABEL_WIDTH = 120;

export default function CompareScreen() {
  const { compareProducts, removeCompare, clearCompare } = useAppState();

  const comparableKeys = useMemo(() => {
    const keys = Object.keys(SPEC_LABELS) as (keyof ProductSpecifications)[];
    return keys.filter((k) =>
      compareProducts.some((p) => Boolean(p.specifications[k]))
    );
  }, [compareProducts]);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Compare Products"
        subtitle={`${compareProducts.length} of 4 selected`}
        rightElement={
          compareProducts.length > 0 ? (
            <Pressable onPress={clearCompare} hitSlop={8}>
              <Text style={styles.clearLink}>Clear</Text>
            </Pressable>
          ) : null
        }
      />

      {compareProducts.length === 0 ? (
        <EmptyState
          icon="compare"
          title="No products to compare"
          message="Tap the compare icon on any product card or product detail page to compare technical specifications side by side."
          actionLabel="Browse Products"
          onAction={() => router.replace('/(tabs)/products')}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tableWrap}
          >
            <View>
              {/* Product Header Row */}
              <View style={styles.row}>
                <View style={styles.labelCol} />
                {compareProducts.map((p) => (
                  <View key={p.id} style={styles.productCol}>
                    <Pressable
                      onPress={() => removeCompare(p.id)}
                      hitSlop={8}
                      style={styles.removeBtn}
                      accessibilityLabel={`Remove ${p.productCode}`}
                    >
                      <Icon name="close" size={14} color={Palette.textSecondary} />
                    </Pressable>
                    <Pressable
                      onPress={() => router.push(`/product/${p.id}`)}
                      style={styles.productHeaderLink}
                    >
                      <View style={styles.imageBox}>
                        {p.images[0] ? (
                          <Image
                            source={{ uri: p.images[0] }}
                            style={styles.image}
                            contentFit="contain"
                            cachePolicy="memory-disk"
                          />
                        ) : (
                          <Icon name="grid" size={20} color={Palette.disabled} />
                        )}
                      </View>
                      <Text style={styles.brandText}>{p.brand}</Text>
                      <Text style={styles.nameText} numberOfLines={2}>
                        {p.productCode}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => openProductEnquiry(p, p.variants[0], 1)}
                      style={styles.enquireBtn}
                    >
                      <Text style={styles.enquireText}>Enquire</Text>
                    </Pressable>
                  </View>
                ))}
              </View>

              {/* Spec Rows */}
              {comparableKeys.map((key) => (
                <View key={key} style={styles.specRow}>
                  <View style={styles.labelCol}>
                    <Text style={styles.specLabel}>{SPEC_LABELS[key]}</Text>
                  </View>
                  {compareProducts.map((p) => (
                    <View key={`${p.id}-${key}`} style={styles.valueCol}>
                      <Text style={styles.specValue}>
                        {p.specifications[key] ?? '—'}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  clearLink: {
    ...Typography.captionMedium,
    color: Palette.textPrimary,
    textDecorationLine: 'underline',
  },
  tableWrap: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    paddingBottom: Spacing.md,
  },
  labelCol: {
    width: LABEL_WIDTH,
    justifyContent: 'center',
    paddingRight: Spacing.sm,
  },
  productCol: {
    width: COL_WIDTH,
    paddingHorizontal: Spacing.xs,
    position: 'relative',
    gap: Spacing.xs,
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 10,
    zIndex: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productHeaderLink: {
    gap: 6,
  },
  imageBox: {
    width: '100%',
    height: 112,
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  brandText: {
    ...Typography.micro,
    color: Palette.textSecondary,
  },
  nameText: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  enquireBtn: {
    backgroundColor: Palette.buttonPrimary,
    borderRadius: Radii.xs,
    paddingVertical: 7,
    alignItems: 'center',
  },
  enquireText: {
    ...Typography.captionMedium,
    color: Palette.buttonText,
  },
  specRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
    paddingVertical: 12,
  },
  valueCol: {
    width: COL_WIDTH,
    paddingHorizontal: Spacing.xs,
    justifyContent: 'center',
  },
  specLabel: {
    ...Typography.captionMedium,
    color: Palette.textSecondary,
  },
  specValue: {
    ...Typography.caption,
    color: Palette.textPrimary,
  },
});
