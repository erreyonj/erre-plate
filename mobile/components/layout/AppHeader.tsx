import React from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logo = require('../../assets/logo-white.png');

interface AppHeaderProps {
  onOpenDrawer: () => void;
}

export default function AppHeader({ onOpenDrawer }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.toolbar}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Pressable
          onPress={onOpenDrawer}
          style={({ pressed }) => [styles.menuBtn, pressed && styles.menuBtnPressed]}
          hitSlop={8}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Ionicons name="menu-outline" size={26} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    zIndex: 100,
    // Elevation shadow on Android
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
    }),
  },
  toolbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logo: {
    width: 140,
    height: 38,
  },
  menuBtn: {
    padding: 4,
    borderRadius: 8,
  },
  menuBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
