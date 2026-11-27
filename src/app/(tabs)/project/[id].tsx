import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/StateViews';
import { SEED_PROJECTS } from '@/data/catalog';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { openGeneralEnquiry } from '@/utils/whatsapp';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const project = useMemo(
    () => SEED_PROJECTS.find((p) => String(p.id) === id || p.slug === id),
    [id]
  );

  if (!project) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Project" />
        <EmptyState
          icon="projects"
          title="Project not found"
          message="Return to the Projects portfolio to explore our lighting installations."
          actionLabel="Back to Projects"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Project" subtitle={project.title} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {project.image ? (
          <Image
            source={{ uri: project.image }}
            style={styles.heroImage}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : null}

        <View style={styles.body}>
          <Text style={styles.eyebrow}>LIGHTING INSTALLATION</Text>
          <Text style={styles.title}>{project.title}</Text>
          {project.excerpt ? (
            <Text style={styles.excerpt}>{project.excerpt}</Text>
          ) : (
            <Text style={styles.excerpt}>
              Architectural and commercial LED lighting project featured in the Cayman Lighting portfolio.
            </Text>
          )}

          <View style={styles.actions}>
            <PrimaryButton
              label="Enquire About Similar Lighting"
              onPress={() => openGeneralEnquiry(`Project reference: ${project.title}`)}
              leftIcon={
                <Icon name="whatsapp" size={18} color={Palette.buttonText} />
              }
            />
            {project.link ? (
              <SecondaryButton
                label="View on Website"
                onPress={() =>
                  WebBrowser.openBrowserAsync(project.link).catch(() => {})
                }
                leftIcon={
                  <Icon name="external" size={16} color={Palette.textPrimary} />
                }
              />
            ) : null}
          </View>
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
    aspectRatio: 4 / 3,
    backgroundColor: Palette.surfaceSecondary,
  },
  body: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  eyebrow: {
    ...Typography.micro,
    color: Palette.textSecondary,
    letterSpacing: 1.1,
  },
  title: {
    ...Typography.h1,
    color: Palette.textPrimary,
  },
  excerpt: {
    ...Typography.body,
    color: Palette.textSecondary,
  },
  actions: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
});
