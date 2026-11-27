import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { COMPANY_CONFIG } from '@/config/company';
import { Palette, Spacing, Typography } from '@/theme/tokens';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="Privacy Policy" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          {COMPANY_CONFIG.name} values your privacy. This mobile application is designed to let you browse lighting products, compare technical specifications, and initiate product enquiries without requiring account registration.
        </Text>

        <Text style={styles.subheading}>Information Stored Locally</Text>
        <Text style={styles.paragraph}>
          Your saved wishlist items, comparison selections, multi-product enquiry list, and recent search terms are stored locally on your device using secure device storage. This data is not uploaded to any tracking or advertising server.
        </Text>

        <Text style={styles.subheading}>WhatsApp Enquiries</Text>
        <Text style={styles.paragraph}>
          When you choose to enquire about a product via WhatsApp, the application composes a message containing the selected product code and specifications and opens WhatsApp on your device. Sending that message is entirely under your control.
        </Text>

        <Text style={styles.subheading}>Analytics &amp; Permissions</Text>
        <Text style={styles.paragraph}>
          This application does not include third-party advertising SDKs, behavioral tracking, or unnecessary device permissions.
        </Text>

        <Text style={styles.subheading}>Contact</Text>
        <Text style={styles.paragraph}>
          For privacy-related questions, please contact us at {COMPANY_CONFIG.email} or visit {COMPANY_CONFIG.websiteUrl}.
        </Text>
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
    padding: Spacing.md,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  heading: {
    ...Typography.h1,
    color: Palette.textPrimary,
    marginBottom: Spacing.xs,
  },
  subheading: {
    ...Typography.h3,
    color: Palette.textPrimary,
    marginTop: Spacing.md,
  },
  paragraph: {
    ...Typography.body,
    color: Palette.textSecondary,
  },
});
