import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from '@/components/ui/ProductCard';
import { OfflineBanner } from '@/components/ui/StateViews';
import { COMPANY_CONFIG } from '@/config/company';
import { useAppState } from '@/context/AppStateContext';
import {
  BRANDS,
  MAIN_CATEGORIES,
  SEED_PROJECTS,
} from '@/data/catalog';

const AREAS = [
  {
    slug: 'wall-light',
    title: 'Bathroom',
    subtitle: 'Moisture-resistant vanity & mirror luminaires',
    categoryName: 'Wall Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2025/11/view-futuristic-lighting-lamp-design-scaled.jpg',
  },
  {
    slug: 'pendant-light',
    title: 'Living Room',
    subtitle: 'Warm pendants, chandeliers & ambient accents',
    categoryName: 'Pendant Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2026/09/polo-villa-cover-image.webp',
  },
  {
    slug: 'ceiling-light',
    title: 'Kitchen',
    subtitle: 'Task downlights, linear strips & ceiling fixtures',
    categoryName: 'Ceiling Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2026/10/cover-image.webp',
  },
  {
    slug: 'outdoor-light',
    title: 'Garden',
    subtitle: 'Weatherproof landscape, path & facade lighting',
    categoryName: 'Outdoor Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2026/04/web-image-Dubai-hills.webp',
  },
];
import { useResponsive } from '@/hooks/useResponsive';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const categoryScrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const {
    isTablet,
    numColumns,
    heroHeight,
    categoryCardSize,
    maxContentWidth,
    scaleFont,
  } = useResponsive();
  const {
    products,
    wishlistIds,
    isWishlisted,
    toggleWishlist,
    isOfflineFallback,
  } = useAppState();

  const featuredProducts = useMemo(() => {
    const byBrand = [
      ...products.filter((p) => p.brand === 'Cayman Newlight').slice(0, 3),
      ...products.filter((p) => p.brand === 'Hyundai Lighting').slice(0, 3),
      ...products.filter((p) => p.brand === 'Luceva').slice(0, 2),
    ];
    return byBrand.slice(0, isTablet ? 8 : 6);
  }, [products, isTablet]);

  const featuredProjects = useMemo(() => SEED_PROJECTS.slice(0, 4), []);

  return (
    <View style={styles.screen}>
      {/* A. Minimal Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: COMPANY_CONFIG.logoUrl }}
            style={styles.logo}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Text style={styles.brandWordmark}>{COMPANY_CONFIG.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => router.push('/search')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Search products"
            style={styles.iconBtn}
          >
            <Icon name="search" size={20} color={Palette.textPrimary} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/wishlist')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Open wishlist"
            style={styles.iconBtn}
          >
            <Icon name="heart" size={20} color={Palette.textPrimary} />
            {wishlistIds.length > 0 && <View style={styles.dotBadge} />}
          </Pressable>
        </View>
      </View>

      {isOfflineFallback && <OfflineBanner />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* B. Hero Section */}
        <View style={[styles.heroContainer, { height: heroHeight }]}>
          <Image
            source={{ uri: COMPANY_CONFIG.heroImageUrl }}
            style={styles.heroImage}
            contentFit="cover"
            transition={250}
            cachePolicy="memory-disk"
          />
          <View style={styles.heroScrim} />
          <View
            style={[
              styles.heroOverlay,
              isTablet && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
            ]}
          >
            <Text style={[styles.heroEyebrow, { fontSize: scaleFont(11) }]}>
              ARCHITECTURAL &amp; LED LIGHTING
            </Text>
            <Text
              style={[
                styles.heroTitle,
                { fontSize: scaleFont(32), lineHeight: scaleFont(38) },
              ]}
            >
              Light that defines your space.
            </Text>
            <Text
              style={[
                styles.heroSubtitle,
                { fontSize: scaleFont(15), lineHeight: scaleFont(22) },
              ]}
            >
              Explore thoughtfully designed lighting solutions for every environment.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/products')}
              accessibilityRole="button"
              accessibilityLabel="Explore Collection"
              style={({ pressed }) => [
                styles.heroCta,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.heroCtaText}>Explore Collection</Text>
              <Icon name="arrowRight" size={16} color={Palette.textPrimary} />
            </Pressable>
          </View>
        </View>

        {/* C. Browse by Category */}
        <View style={[styles.section, isTablet && { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>
              Browse by Category
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/categories')}
              hitSlop={8}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAll}>All Categories</Text>
              <Text style={styles.seeAllArrow}>&gt;</Text>
            </Pressable>
          </View>

          <View style={styles.sliderWrapper}>
            <ScrollView
              ref={categoryScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {MAIN_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.slug}
                  onPress={() =>
                    router.push({
                      pathname: '/category/[slug]',
                      params: { slug: cat.slug, name: cat.name },
                    })
                  }
                  style={({ pressed }) => [
                    styles.categoryCard,
                    { width: categoryCardSize },
                    pressed && styles.pressed,
                  ]}
                >
                  <View
                    style={[
                      styles.categoryImageBox,
                      { width: categoryCardSize, height: categoryCardSize },
                    ]}
                  >
                    {cat.imageUrl ? (
                      <Image
                        source={{ uri: cat.imageUrl }}
                        style={styles.categoryImage}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                      />
                    ) : (
                      <Icon name="grid" size={26} color={Palette.textPrimary} />
                    )}
                  </View>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              onPress={() =>
                categoryScrollRef.current?.scrollTo({ x: 260, animated: true })
              }
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Scroll categories"
              style={styles.sliderNextBtn}
            >
              <Text style={styles.sliderNextText}>&gt;</Text>
            </Pressable>
          </View>
        </View>

        {/* D. Shop by Brand */}
        <View style={[styles.section, isTablet && { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>
              Our Brands
            </Text>
          </View>
          <View style={styles.brandList}>
            {BRANDS.map((brand) => (
              <Pressable
                key={brand.slug}
                onPress={() =>
                  router.push({
                    pathname: '/brand/[slug]',
                    params: { slug: brand.slug, name: brand.name },
                  })
                }
                style={({ pressed }) => [
                  styles.brandCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.brandInfo}>
                  {brand.logoUrl ? (
                    <Image
                      source={{ uri: brand.logoUrl }}
                      style={styles.brandLogo}
                      contentFit="contain"
                      cachePolicy="memory-disk"
                    />
                  ) : null}
                  <Text style={styles.brandName}>{brand.name}</Text>
                  <Text style={styles.brandTagline} numberOfLines={2}>
                    {brand.tagline}
                  </Text>
                </View>
                <Icon
                  name="arrowRight"
                  size={18}
                  color={Palette.textSecondary}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* E. Featured Products */}
        <View style={[styles.section, isTablet && { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>
              Featured Luminaires
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/products')}
              hitSlop={8}
            >
              <Text style={styles.seeAll}>View Catalogue</Text>
            </Pressable>
          </View>

          <View style={styles.productGrid}>
            {featuredProducts.map((product) => (
              <View
                key={product.id}
                style={{
                  width:
                    numColumns === 4
                      ? '23.8%'
                      : numColumns === 3
                        ? '32%'
                        : '48.5%',
                }}
              >
                <ProductCard
                  product={product}
                  isWishlisted={isWishlisted(product.id)}
                  onPress={() => router.push(`/product/${product.id}`)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* F. Areas */}
        <View style={[styles.section, isTablet && { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>
              Areas
            </Text>
          </View>
          <View style={styles.areasGrid}>
            {AREAS.map((area) => (
              <Pressable
                key={area.slug}
                onPress={() =>
                  router.push({
                    pathname: '/category/[slug]',
                    params: { slug: area.slug, name: area.categoryName },
                  })
                }
                style={({ pressed }) => [
                  styles.areaCard,
                  isTablet && { width: '23.8%' },
                  pressed && styles.pressed,
                ]}
              >
                <Image
                  source={{ uri: area.imageUrl }}
                  style={styles.areaImg}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
                <View style={styles.areaBody}>
                  <Text
                    style={[styles.areaTitle, { fontSize: scaleFont(16) }]}
                  >
                    {area.title}
                  </Text>
                  <Text style={styles.areaSub} numberOfLines={2}>
                    {area.subtitle}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* G. Projects & Inspiration */}
        <View style={[styles.section, isTablet && { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>
              Projects &amp; Inspiration
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/projects')}
              hitSlop={8}
            >
              <Text style={styles.seeAll}>All Projects</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {featuredProjects.map((proj) => (
              <Pressable
                key={proj.id}
                onPress={() => router.push(`/project/${proj.id}`)}
                style={({ pressed }) => [
                  styles.projectCard,
                  pressed && styles.pressed,
                ]}
              >
                {proj.image ? (
                  <Image
                    source={{ uri: proj.image }}
                    style={styles.projectImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                ) : (
                  <View style={[styles.projectImage, styles.projectPlaceholder]} />
                )}
                <Text style={styles.projectTitle} numberOfLines={2}>
                  {proj.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Palette.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logo: {
    width: 34,
    height: 24,
  },
  brandWordmark: {
    ...Typography.h3,
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dotBadge: {
    position: 'absolute',
    top: 7,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Palette.textPrimary,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  heroContainer: {
    height: 410,
    position: 'relative',
    backgroundColor: Palette.textPrimary,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(12, 12, 12, 0.48)',
  },
  heroOverlay: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.xl,
    gap: Spacing.xs,
  },
  heroEyebrow: {
    ...Typography.micro,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1.4,
  },
  heroTitle: {
    ...Typography.heroTitle,
    color: Palette.buttonText,
  },
  heroSubtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.88)',
    marginBottom: Spacing.xs,
  },
  heroCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Palette.background,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.sm,
  },
  heroCtaText: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Palette.textPrimary,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAll: {
    ...Typography.captionMedium,
    color: Palette.textSecondary,
    textDecorationLine: 'underline',
  },
  seeAllArrow: {
    ...Typography.captionMedium,
    color: Palette.textSecondary,
  },
  sliderWrapper: {
    position: 'relative',
  },
  sliderNextBtn: {
    position: 'absolute',
    right: Spacing.xs,
    top: 38,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.overlayLight,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderNextText: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
    lineHeight: 18,
  },
  horizontalList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  categoryCard: {
    width: 112,
    gap: Spacing.xs,
  },
  categoryImageBox: {
    width: 112,
    height: 112,
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    ...Typography.captionMedium,
    color: Palette.textPrimary,
  },
  brandList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.md,
  },
  brandInfo: {
    flex: 1,
    gap: 4,
  },
  brandLogo: {
    width: 72,
    height: 24,
    marginBottom: 4,
  },
  brandName: {
    ...Typography.h3,
    color: Palette.textPrimary,
  },
  brandTagline: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-between',
    rowGap: Spacing.sm,
  },
  gridItem: {
    width: '48.5%',
  },
  areasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-between',
    rowGap: Spacing.sm,
  },
  areaCard: {
    width: '48.5%',
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radii.sm,
    overflow: 'hidden',
  },
  areaImg: {
    width: '100%',
    aspectRatio: 1.25,
    backgroundColor: Palette.surfaceSecondary,
  },
  areaBody: {
    padding: Spacing.sm,
    gap: 3,
  },
  areaTitle: {
    ...Typography.h3,
    color: Palette.textPrimary,
  },
  areaSub: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
  projectCard: {
    width: 220,
    gap: Spacing.xs,
  },
  projectImage: {
    width: 220,
    height: 150,
    borderRadius: Radii.sm,
    backgroundColor: Palette.surfaceSecondary,
  },
  projectPlaceholder: {
    borderWidth: 1,
    borderColor: Palette.border,
  },
  projectTitle: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  footer: {
    marginTop: Spacing.xxl,
    marginHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    gap: Spacing.sm,
  },
  footerHeading: {
    ...Typography.h3,
    color: Palette.textPrimary,
  },
  footerSub: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
  footerLinks: {
    marginTop: Spacing.xs,
  },
  footerLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  footerLinkText: {
    ...Typography.body,
    color: Palette.textPrimary,
  },
  pressed: {
    opacity: 0.78,
  },
});
