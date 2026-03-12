import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/theme';

type Role = 'customer' | 'chef';

interface TabConfig {
  routeName: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const tabConfig: Record<Role, TabConfig[]> = {
  customer: [
    { routeName: 'BrowseTab', icon: 'home-outline', activeIcon: 'home' },
    { routeName: 'OrdersTab', icon: 'receipt-outline', activeIcon: 'receipt' },
    { routeName: 'ProfileTab', icon: 'person-outline', activeIcon: 'person' },
  ],
  chef: [
    { routeName: 'MenusTab', icon: 'grid-outline', activeIcon: 'grid' },
    { routeName: 'TicketsTab', icon: 'receipt-outline', activeIcon: 'receipt' },
    { routeName: 'ChefProfileTab', icon: 'person-outline', activeIcon: 'person' },
  ],
};

interface RoleBottomTabBarProps extends BottomTabBarProps {
  role: Role;
}

export default function RoleBottomTabBar({ state, descriptors, navigation, role }: RoleBottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabs = tabConfig[role];

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = tabs[index];

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tab,
                pressed && styles.tabPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Ionicons
                  name={isFocused ? tab.activeIcon : tab.icon}
                  size={22}
                  color={isFocused ? colors.gold : 'rgba(255,255,255,0.75)'}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    alignItems: 'center',
    pointerEvents: 'box-none',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 20 },
    }),
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: colors.charcoal,
    borderRadius: 999,
    height: 64,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabPressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(241,184,77,0.15)',
  },
});
