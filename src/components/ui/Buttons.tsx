import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
  accessibilityLabel?: string;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
  leftIcon,
  accessibilityLabel,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.primary,
        disabled && styles.primaryDisabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Palette.buttonText} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text style={styles.primaryText}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
  style,
  leftIcon,
  accessibilityLabel,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.secondary,
        disabled && styles.secondaryDisabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {leftIcon}
      <Text
        style={[
          styles.secondaryText,
          disabled && { color: Palette.disabled },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: Palette.buttonPrimary,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    minHeight: 48,
  },
  primaryDisabled: {
    backgroundColor: Palette.disabled,
  },
  primaryText: {
    ...Typography.bodyMedium,
    color: Palette.buttonText,
  },
  secondary: {
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    minHeight: 48,
  },
  secondaryDisabled: {
    borderColor: Palette.border,
  },
  secondaryText: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  pressed: {
    opacity: 0.78,
  },
});
