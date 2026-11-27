/**
 * Central configuration for Cayman Lighting (Sri Lanka).
 *
 * Update the WhatsApp number and Sri Lanka showroom details here once
 * confirmed by the client without modifying any individual screen.
 */
export const COMPANY_CONFIG = {
  name: 'Cayman Lighting',
  country: 'Sri Lanka',
  websiteUrl: 'https://caymelighting.com/',
  logoUrl: 'https://caymelighting.com/wp-content/uploads/2025/12/cayman-logo-02-scaled.png',
  heroImageUrl:
    'https://caymelighting.com/wp-content/uploads/2025/11/ai-generated-modern-styled-entryway-min-scaled.jpg',
  secondaryHeroImageUrl:
    'https://caymelighting.com/wp-content/uploads/2025/11/view-futuristic-lighting-lamp-design-scaled.jpg',

  /**
   * Configurable WhatsApp enquiry number (digits only with country code, no '+').
   * Placeholder Sri Lanka number (+94 77 000 0000) for Phase 1 testing.
   * Replace with the client-confirmed Sri Lankan WhatsApp Business number.
   */
  whatsappNumber: '94770000000',
  whatsappDisplay: '+94 77 000 0000 (Pending client confirmation)',

  /** Verified company email from caymelighting.com */
  email: 'contact@caymelighting.com',

  /** Pending Sri Lanka showroom / telephone confirmation */
  telephone: null as string | null,
  address: null as string | null,
  openingHours: null as string | null,

  /** Official social accounts linked from caymelighting.com */
  socialLinks: [
    {
      id: 'facebook',
      name: 'Facebook',
      glyph: 'f',
      url: 'https://www.facebook.com/hyundailightingae/',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      glyph: 'in',
      url: 'https://www.linkedin.com/company/hyundailighting/',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      glyph: 'IG',
      url: 'https://www.instagram.com/hyundailight.ae',
    },
    {
      id: 'x',
      name: 'X',
      glyph: '𝕏',
      url: 'https://x.com/HyundaiLightAE',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      glyph: '▶\uFE0E',
      url: 'https://www.youtube.com/@HyundaiLightingUAE',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      glyph: '♪',
      url: 'https://www.tiktok.com/@hyundai_lighting.ae',
    },
  ],
} as const;
