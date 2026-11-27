import { PrimaryButton } from '@/components/ui/Buttons';
import { Icon } from '@/components/ui/Icon';
import { COMPANY_CONFIG } from '@/config/company';
import { Palette, Radii, Spacing, Typography } from '@/theme/tokens';
import { openGeneralEnquiry } from '@/utils/whatsapp';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ContactScreen() {
  const insets = useSafeAreaInsets();

  const handleOpenEmail = () => {
    Linking.openURL(`mailto:${COMPANY_CONFIG.email}`).catch(() => { });
  };

  const handleOpenWebsite = () => {
    WebBrowser.openBrowserAsync(COMPANY_CONFIG.websiteUrl).catch(() => { });
  };

  const handleOpenSocial = (url: string) => {
    Linking.openURL(url).catch(() => {
      WebBrowser.openBrowserAsync(url).catch(() => {});
    });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}>
        <Text style={styles.title}>Contact</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Primary WhatsApp Enquiry */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Chat With Us </Text>
          <Text style={styles.heroText}>
            Speak with our lighting specialists for product availability, technical guidance, or project quotations.
          </Text>
          <PrimaryButton
            label="Contact via WhatsApp"
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
                Linking.openURL(`tel:${COMPANY_CONFIG.telephone}`).catch(() => { })
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

        {/* Find us also in */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FIND US ALSO IN</Text>
          <View style={styles.socialRow}>
            {COMPANY_CONFIG.socialLinks.map((social) => (
              <Pressable
                key={social.id}
                onPress={() => handleOpenSocial(social.url)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${social.name}`}
                style={({ pressed }) => [
                  styles.socialCircle,
                  pressed && styles.pressed,
                ]}
              >
                {social.id === 'instagram' ? (
                  <View style={styles.igOuter}>
                    <View style={styles.igDot} />
                    <View style={styles.igLens} />
                  </View>
                ) : (
                  <Text style={styles.socialGlyph}>{social.glyph}</Text>
                )}
              </Pressable>
            ))}
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
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  socialCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialGlyph: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  igOuter: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.7,
    borderColor: Palette.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  igLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.6,
    borderColor: Palette.textPrimary,
  },
  igDot: {
    position: 'absolute',
    top: 2.5,
    right: 2.5,
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: Palette.textPrimary,
  },
  pressed: {
    opacity: 0.78,
  },
});
