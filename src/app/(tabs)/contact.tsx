import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Icon } from '@/components/ui/Icon';
import { COMPANY_CONFIG } from '@/config/company';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { openGeneralEnquiry } from '@/utils/whatsapp';

export default function ContactScreen() {
  const insets = useSafeAreaInsets();

  const handleOpenEmail = () => {
    Linking.openURL(`mailto:${COMPANY_CONFIG.email}`).catch(() => {});
  };

  const handleOpenWebsite = () => {
    WebBrowser.openBrowserAsync(COMPANY_CONFIG.websiteUrl).catch(() => {});
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}>
        <Text style={styles.title}>Contact</Text>
        <Text style={styles.subtitle}>
          Product enquiries, specifications &amp; project consultations
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Primary WhatsApp Enquiry */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Direct WhatsApp Enquiry</Text>
          <Text style={styles.heroText}>
            Speak with our lighting specialists for product availability, technical guidance, or project quotations.
          </Text>
          <PrimaryButton
            label="Enquire via WhatsApp"
            onPress={() => openGeneralEnquiry()}
            leftIcon={
              <Icon name="whatsapp" size={18} color={Palette.buttonText} />
            }
          />
          <Text style={styles.configNote}>
            Configured WhatsApp: {COMPANY_CONFIG.whatsappDisplay}
          </Text>
        </View>

        {/* Verified Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CHANNELS</Text>

          <Pressable
            onPress={handleOpenEmail}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <Icon name="mail" size={18} color={Palette.textPrimary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Email</Text>
                <Text style={styles.rowValue}>{COMPANY_CONFIG.email}</Text>
              </View>
            </View>
            <Icon name="external" size={16} color={Palette.textSecondary} />
          </Pressable>

          <Pressable
            onPress={handleOpenWebsite}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <Icon name="globe" size={18} color={Palette.textPrimary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Official Website</Text>
                <Text style={styles.rowValue}>caymelighting.com</Text>
              </View>
            </View>
            <Icon name="external" size={16} color={Palette.textSecondary} />
          </Pressable>

          {COMPANY_CONFIG.telephone ? (
            <Pressable
              onPress={() =>
                Linking.openURL(`tel:${COMPANY_CONFIG.telephone}`).catch(() => {})
              }
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Icon name="phone" size={18} color={Palette.textPrimary} />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Telephone</Text>
                  <Text style={styles.rowValue}>{COMPANY_CONFIG.telephone}</Text>
                </View>
              </View>
              <Icon name="external" size={16} color={Palette.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        {/* Company & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>COMPANY</Text>

          <Pressable
            onPress={() => router.push('/about')}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <Icon name="info" size={18} color={Palette.textPrimary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>About Cayman Lighting</Text>
                <Text style={styles.rowValue}>Our brands &amp; lighting solutions</Text>
              </View>
            </View>
            <Icon name="arrowRight" size={16} color={Palette.textSecondary} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/privacy')}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <Icon name="shield" size={18} color={Palette.textPrimary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Privacy Policy</Text>
                <Text style={styles.rowValue}>How your data is handled</Text>
              </View>
            </View>
            <Icon name="arrowRight" size={16} color={Palette.textSecondary} />
          </Pressable>
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
  content: {
    padding: Spacing.md,
    gap: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  heroCard: {
    padding: Spacing.lg,
    backgroundColor: Palette.surfaceSecondary,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.sm,
  },
  heroTitle: {
    ...Typography.h2,
    color: Palette.textPrimary,
  },
  heroText: {
    ...Typography.body,
    color: Palette.textSecondary,
    marginBottom: Spacing.xs,
  },
  configNote: {
    ...Typography.micro,
    color: Palette.textMuted,
    marginTop: 2,
  },
  section: {
    gap: Spacing.xs,
  },
  sectionLabel: {
    ...Typography.micro,
    color: Palette.textSecondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: Radii.xs,
    backgroundColor: Palette.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    ...Typography.bodyMedium,
    color: Palette.textPrimary,
  },
  rowValue: {
    ...Typography.caption,
    color: Palette.textSecondary,
  },
  pressed: {
    opacity: 0.78,
  },
});
