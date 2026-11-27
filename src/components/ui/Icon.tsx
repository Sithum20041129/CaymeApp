import { Palette } from '@/theme/tokens';
import { SFSymbol, SymbolView } from 'expo-symbols';
import { Platform, Text, View } from 'react-native';

export type AppIconName =
  | 'home'
  | 'grid'
  | 'heart'
  | 'heart.fill'
  | 'projects'
  | 'contact'
  | 'search'
  | 'filter'
  | 'sort'
  | 'back'
  | 'close'
  | 'arrowRight'
  | 'external'
  | 'compare'
  | 'whatsapp'
  | 'mail'
  | 'globe'
  | 'phone'
  | 'plus'
  | 'minus'
  | 'check'
  | 'trash'
  | 'info'
  | 'shield'
  | 'doc';

const SYMBOL_MAP: Record<
  AppIconName,
  { ios: SFSymbol; android: string; fallback: string }
> = {
  home: { ios: 'house', android: 'home', fallback: '⌂' },
  grid: { ios: 'square.grid.2x2', android: 'grid_view', fallback: '⊞' },
  heart: { ios: 'heart', android: 'favorite_border', fallback: '♡' },
  'heart.fill': { ios: 'heart.fill', android: 'favorite', fallback: '♥' },
  projects: { ios: 'photo.on.rectangle', android: 'collections', fallback: '◫' },
  contact: { ios: 'bubble.left.and.bubble.right', android: 'chat', fallback: '✉' },
  search: { ios: 'magnifyingglass', android: 'search', fallback: '⌕' },
  filter: { ios: 'slider.horizontal.3', android: 'tune', fallback: '☰' },
  sort: { ios: 'arrow.up.arrow.down', android: 'sort', fallback: '⇅' },
  back: { ios: 'chevron.left', android: 'arrow_back', fallback: '‹' },
  close: { ios: 'xmark', android: 'close', fallback: '✕' },
  arrowRight: { ios: 'arrow.right', android: 'arrow_forward', fallback: '→' },
  external: { ios: 'arrow.up.right', android: 'open_in_new', fallback: '↗' },
  compare: { ios: 'square.split.2x1', android: 'compare_arrows', fallback: '⇄' },
  whatsapp: { ios: 'message.fill', android: 'chat', fallback: '✆' },
  mail: { ios: 'envelope', android: 'mail_outline', fallback: '✉' },
  globe: { ios: 'globe', android: 'language', fallback: '◎' },
  phone: { ios: 'phone', android: 'phone', fallback: '☏' },
  plus: { ios: 'plus', android: 'add', fallback: '+' },
  minus: { ios: 'minus', android: 'remove', fallback: '−' },
  check: { ios: 'checkmark', android: 'check', fallback: '✓' },
  trash: { ios: 'trash', android: 'delete_outline', fallback: '⌫' },
  info: { ios: 'info.circle', android: 'info_outline', fallback: 'ⓘ' },
  shield: { ios: 'lock.shield', android: 'verified_user', fallback: '◈' },
  doc: { ios: 'doc.text', android: 'description', fallback: '▤' },
};

interface IconProps {
  name: AppIconName;
  size?: number;
  color?: string;
}

export function Icon({
  name,
  size = 20,
  color = Palette.textPrimary,
}: IconProps) {
  const mapped = SYMBOL_MAP[name];

  // On web, SymbolView tintColor on MaterialSymbols does not reliably update
  // dynamically (especially for filled vs outline heart), so render a crisp
  // vector-styled glyph for heart states on web.
  if (Platform.OS === 'web' && (name === 'heart' || name === 'heart.fill')) {
    return (
      <View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: size * 0.95,
            lineHeight: size,
            color,
            userSelect: 'none',
          }}
        >
          {mapped.fallback}
        </Text>
      </View>
    );
  }

  return (
    <SymbolView
      name={{
        ios: mapped.ios,
        android: mapped.android as never,
        web: mapped.android as never,
      }}
      size={size}
      tintColor={color}
      fallback={
        <View
          style={{
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: size * 0.85, color, lineHeight: size }}>
            {mapped.fallback}
          </Text>
        </View>
      }
    />
  );
}
