import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAppState } from '@/context/AppStateContext';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { BrandName, EMPTY_FILTERS, FilterState } from '@/types/product';
import {
  countActiveFilters,
  extractAvailableFilterOptions,
  filterAndSortProducts,
} from '@/utils/filterProducts';

export default function FiltersScreen() {
  const insets = useSafeAreaInsets();
  const { products, filters, setFilters, sortBy } = useAppState();
  const [draft, setDraft] = useState<FilterState>(filters);

  const options = useMemo(
    () => extractAvailableFilterOptions(products),
    [products]
  );

  const matchingCount = useMemo(
    () => filterAndSortProducts(products, draft, '', sortBy).length,
    [products, draft, sortBy]
  );

  const activeCount = useMemo(() => countActiveFilters(draft), [draft]);

  const toggleItem = (
    group: Exclude<keyof FilterState, 'brands'>,
    value: string
  ) => {
    setDraft((prev) => {
      const current = prev[group];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: next };
    });
  };

  const toggleBrand = (brand: BrandName) => {
    setDraft((prev) => {
      const next = prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: next };
    });
  };

  const handleApply = () => {
    setFilters(draft);
    router.back();
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
  };

  const renderChipGroup = (
    title: string,
    values: string[],
    selectedValues: string[],
    onToggle: (val: string) => void
  ) => {
    if (values.length === 0) return null;
    return (
      <View style={styles.group}>
        <Text style={styles.groupTitle}>{title}</Text>
        <View style={styles.chipGrid}>
          {values.map((val) => {
            const selected = selectedValues.includes(val);
            return (
              <Pressable
                key={val}
                onPress={() => onToggle(val)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {val}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Filters"
        subtitle={
          activeCount > 0 ? `${activeCount} selected` : 'Refine catalogue'
        }
        rightElement={
          activeCount > 0 ? (
            <Pressable onPress={handleClear} hitSlop={8}>
              <Text style={styles.clearLink}>Clear All</Text>
            </Pressable>
          ) : null
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderChipGroup('Brand', options.brands, draft.brands, (val) =>
          toggleBrand(val as BrandName)
        )}

        {renderChipGroup(
          'Category',
          options.categories,
          draft.categories,
          (val) => toggleItem('categories', val)
        )}

        {renderChipGroup(
          'Product Type',
          options.productTypes,
          draft.productTypes,
          (val) => toggleItem('productTypes', val)
        )}

        {renderChipGroup(
          'Power / Wattage',
          options.powers,
          draft.powers,
          (val) => toggleItem('powers', val)
        )}

        {renderChipGroup(
          'Colour Temperature',
          options.colorTemperatures,
          draft.colorTemperatures,
          (val) => toggleItem('colorTemperatures', val)
        )}

        {renderChipGroup(
          'Voltage',
          options.voltages,
          draft.voltages,
          (val) => toggleItem('voltages', val)
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, Spacing.md) },
        ]}
      >
        <View style={styles.footerRow}>
          <SecondaryButton
            label="Reset"
            onPress={handleClear}
            style={{ flex: 0.4 }}
          />
          <PrimaryButton
            label={`Apply (${matchingCount})`}
            onPress={handleApply}
            style={{ flex: 1 }}
          />
        </View>
      </View>
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
  content: {
    padding: Spacing.md,
    gap: Spacing.lg,
    paddingBottom: 110,
  },
  group: {
    gap: Spacing.sm,
  },
  groupTitle: {
    ...Typography.h3,
    color: Palette.textPrimary,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    backgroundColor: Palette.background,
  },
  chipSelected: {
    backgroundColor: Palette.buttonPrimary,
    borderColor: Palette.buttonPrimary,
  },
  chipText: {
    ...Typography.captionMedium,
    color: Palette.textPrimary,
  },
  chipTextSelected: {
    color: Palette.buttonText,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Palette.background,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
