import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/ui/Buttons';
import { AppIconName, Icon } from '@/components/ui/Icon';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';

export function LoadingGrid({ count = 6 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <View style={styles.grid}>
      {items.map((_, idx) => (
        <View key={idx} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonBody}>
            <View style={[styles.skeletonLine, { width: '48%' }]} />
            <View style={[styles.skeletonLine, { width: '82%', height: 14 }]} />
            <View style={[styles.skeletonLine, { width: '36%' }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

interface EmptyStateProps {
  icon?: AppIconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'grid',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.centerState}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={24} color={Palette.textPrimary} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {actionLabel && onAction && (
        <PrimaryButton
          label={actionLabel}
          onPress={onAction}
          style={styles.actionBtn}
        />
      )}
    </View>
  );
}

export function ErrorState({
  title = 'Unable to load content',
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon="info"
      title={title}
      message={message}
      actionLabel={onRetry ? 'Try Again' : undefined}
      onAction={onRetry}
    />
  );
}

export function OfflineBanner() {
  return (
    <View style={styles.offlineBanner}>
      <Icon name="info" size={14} color={Palette.textSecondary} />
      <Text style={styles.offlineText}>
        Showing cached catalogue — connect to refresh latest products.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  skeletonCard: {
    width: '48%',
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
    backgroundColor: Palette.background,
  },
  skeletonImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Palette.surfaceSecondary,
  },
  skeletonBody: {
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  skeletonLine: {
    height: 10,
    borderRadius: Radii.xs,
    backgroundColor: Palette.surfaceTertiary,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: Radii.pill,
    backgroundColor: Palette.surfaceSecondary,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  stateTitle: {
    ...Typography.h3,
    color: Palette.textPrimary,
    textAlign: 'center',
  },
  stateMessage: {
    ...Typography.body,
    color: Palette.textSecondary,
    textAlign: 'center',
  },
  actionBtn: {
    marginTop: Spacing.sm,
    minWidth: 180,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Palette.surfaceSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  offlineText: {
    ...Typography.caption,
    color: Palette.textSecondary,
    flex: 1,
  },
});
