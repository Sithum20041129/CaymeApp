import { Icon } from '@/components/ui/Icon';
import { useAppState } from '@/context/AppStateContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Palette } from '@/theme/tokens';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { wishlistIds } = useAppState();
  const { isTablet } = useResponsive();

  const baseBarHeight = Platform.OS === 'web' ? 68 : Platform.OS === 'ios' ? 58 : 66;
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.textPrimary,
        tabBarInactiveTintColor: Palette.textSecondary,
        tabBarStyle: {
          backgroundColor: Palette.background,
          borderTopColor: Palette.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: baseBarHeight + insets.bottom,
          paddingBottom: bottomPad,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: isTablet ? 13 : 11,
          lineHeight: isTablet ? 16 : 14,
          fontWeight: '500',
          letterSpacing: 0.1,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home"
              size={isTablet ? 23 : 21}
              color={focused ? Palette.textPrimary : Palette.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ focused }) => (
            <Icon
              name="grid"
              size={isTablet ? 23 : 21}
              color={focused ? Palette.textPrimary : Palette.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrap}>
              <Icon
                name={focused ? 'heart.fill' : 'heart'}
                size={isTablet ? 23 : 21}
                color={focused ? Palette.buttonPrimary : Palette.textSecondary}
              />
              {wishlistIds.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {wishlistIds.length > 9 ? '9+' : wishlistIds.length}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ focused }) => (
            <Icon
              name="projects"
              size={isTablet ? 23 : 21}
              color={focused ? Palette.textPrimary : Palette.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ focused }) => (
            <Icon
              name="contact"
              size={isTablet ? 23 : 21}
              color={focused ? Palette.textPrimary : Palette.textSecondary}
            />
          ),
        }}
      />

      {/* Hidden nested routes that keep the bottom tab bar visible */}
      <Tabs.Screen name="product/[id]" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="category/[slug]" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="categories" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="brand/[slug]" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="project/[id]" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="compare" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="about" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="privacy" options={{ tabBarItemStyle: { display: 'none' } }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Palette.buttonText,
    fontSize: 9,
    fontWeight: '700',
  },
});
