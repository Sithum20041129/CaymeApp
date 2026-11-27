import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAppState } from '@/context/AppStateContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { CategoryItem } from '@/types/product';

export default function AllCategoriesScreen() {
  const { categories } = useAppState();
  const { numColumns, isTablet, maxContentWidth, scaleFont } = useResponsive();
  const cardWidth =
    numColumns === 4 ? '23.8%' : numColumns === 3 ? '32%' : '48.5%';

  const renderCategory = ({ item }: { item: CategoryItem }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/category/[slug]',
          params: { slug: item.slug, name: item.name },
        })
      }
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageBox}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        ) : (
          <Icon name="grid" size={28} color={Palette.textPrimary} />
        )}
      </View>
      <View style={styles.meta}>
        <Text
          style={[styles.name, { fontSize: scaleFont(15) }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          style={[styles.desc, { fontSize: scaleFont(12) }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="All Categories"
        subtitle={`${categories.length} lighting categories`}
      />

      <FlatList
        key={`all-cats-${numColumns}`}
        data={categories}
        keyExtractor={(item) => item.slug}
        numColumns={numColumns}
        renderItem={renderCategory}
        contentContainerStyle={[
          styles.listContent,
          isTablet && {
            maxWidth: maxContentWidth,
            width: '100%',
            alignSelf: 'center',
          },
        ]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Palette.background,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1.15,
    backgroundColor: Palette.surfaceSecondary,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  meta: {
    padding: Spacing.sm,
    gap: 4,
  },
  name: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  desc: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
});
