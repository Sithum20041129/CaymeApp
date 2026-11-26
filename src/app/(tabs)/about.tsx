import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/ui/Buttons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { COMPANY_CONFIG } from '@/config/company';
import { BRANDS } from '@/data/catalog';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';

export default function AboutScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="About Cayman Lighting" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: COMPANY_CONFIG.secondaryHeroImageUrl }}
          style={styles.heroImage}
          contentFit="cover"
          cachePolicy="memory-disk"
        />

        <View style={styles.section}>
          <Text style={styles.eyebrow}>OUR PHILOSOPHY</Text>
          <Text style={styles.heading}>
            Modern LED lighting engineered for architecture and everyday living.
          </Text>
          <Text style={styles.paragraph}>
            Since 2007, Cayman Lighting has delivered energy-efficient LED lighting solutions across residential, commercial, industrial, indoor, and outdoor environments.
          </Text>
          <Text style={styles.paragraph}>
            Our catalogue spans decorative pendants, recessed downlights, magnetic track systems, architectural wall lights, linear profiles, and weather-resistant exterior luminaires.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Brands</Text>
          {BRANDS.map((brand) => (
            <View key={brand.slug} style={styles.brandBox}>
              <Text style={styles.brandName}>{brand.name}</Text>
              <Text style={styles.brandDesc}>{brand.tagline}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Solutions</Text>
          <View style={styles.solutionsGrid}>
            {[
              'Residential Lighting',
              'Commercial & Office',
              'Indoor Architectural',
              'Outdoor & Landscape',
            ].map((item) => (
              <View key={item} style={styles.solutionItem}>
                <Text style={styles.solutionText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <PrimaryButton
            label="Explore Product Catalogue"
            onPress={() => router.replace('/(tabs)/products')}
          />
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
  content: {
    paddingBottom: Spacing.xxl,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: Palette.surfaceSecondary,
  },
  section: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  eyebrow: {
    ...Typography.micro,
    color: Palette.textSecondary,
    letterSpacing: 1.2,
  },
  heading: {
    ...Typography.h1,
    color: Palette.textPrimary,
  },
  paragraph: {
    ...Typography.body,
    color: Palette.textSecondary,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Palette.textPrimary,
  },
  brandBox: {
    padding: Spacing.md,
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 4,
  },
  brandName: {
    ...Typography.h3,
    color: Palette.textPrimary,
  },
  brandDesc: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
  solutionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  solutionItem: {
    width: '48.5%',
    padding: Spacing.md,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
  },
  solutionText: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  ctaSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
  },
});
