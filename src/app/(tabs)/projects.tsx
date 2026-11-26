import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { SEED_PROJECTS } from '@/data/catalog';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { ProjectItem } from '@/types/product';

export default function ProjectsScreen() {
  const insets = useSafeAreaInsets();

  const renderProject = ({ item }: { item: ProjectItem }) => (
    <Pressable
      onPress={() => router.push(`/project/${item.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Text style={styles.eyebrow}>LIGHTING PORTFOLIO</Text>
          <Icon name="arrowRight" size={15} color={Palette.textSecondary} />
        </View>
        <Text style={styles.projectTitle}>{item.title}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}>
        <Text style={styles.title}>Projects</Text>
        <Text style={styles.subtitle}>
          Architectural, residential, and commercial lighting installations
        </Text>
      </View>

      <FlatList
        data={SEED_PROJECTS}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderProject}
        contentContainerStyle={styles.list}
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
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
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
  list: {
    padding: Spacing.md,
    gap: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Palette.background,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: Palette.surfaceSecondary,
  },
  placeholder: {
    backgroundColor: Palette.surfaceTertiary,
  },
  body: {
    padding: Spacing.md,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    ...Typography.micro,
    color: Palette.textSecondary,
    letterSpacing: 1,
  },
  projectTitle: {
    ...Typography.h3,
    color: Palette.textPrimary,
  },
});
