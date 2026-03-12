import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

type Role = 'customer' | 'chef';

interface DrawerItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  screenName?: string;
  action?: 'logout';
}

interface DrawerSection {
  title: string;
  items: DrawerItem[];
}

const drawerConfig: Record<Role, DrawerSection[]> = {
  customer: [
    {
      title: 'Account & Settings',
      items: [
        { key: 'account', label: 'Account', icon: 'person-circle-outline', screenName: 'ProfileTab' },
        { key: 'payments', label: 'Payments', icon: 'card-outline', screenName: 'ProfileTab' },
      ],
    },
    {
      title: 'Activity',
      items: [
        { key: 'favorites', label: 'Favorites', icon: 'heart-outline', screenName: 'ProfileTab' },
        { key: 'reviews', label: 'Reviews', icon: 'star-outline', screenName: 'ProfileTab' },
      ],
    },
    {
      title: 'System',
      items: [
        { key: 'help', label: 'Help', icon: 'help-circle-outline', screenName: 'ProfileTab' },
        { key: 'logout', label: 'Logout', icon: 'log-out-outline', action: 'logout' },
      ],
    },
  ],
  chef: [
    {
      title: 'Account & Settings',
      items: [
        { key: 'account', label: 'Account', icon: 'person-circle-outline', screenName: 'ChefProfileTab' },
        { key: 'payouts', label: 'Payouts', icon: 'wallet-outline', screenName: 'ChefProfileTab' },
      ],
    },
    {
      title: 'Activity',
      items: [
        { key: 'earnings', label: 'Earnings', icon: 'cash-outline', screenName: 'ChefProfileTab' },
        { key: 'availability', label: 'Availability', icon: 'calendar-outline', screenName: 'ChefProfileTab' },
      ],
    },
    {
      title: 'System',
      items: [
        { key: 'help', label: 'Help', icon: 'help-circle-outline', screenName: 'ChefProfileTab' },
        { key: 'logout', label: 'Logout', icon: 'log-out-outline', action: 'logout' },
      ],
    },
  ],
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 360);

interface RoleDrawerProps {
  role: Role;
  open: boolean;
  onClose: () => void;
  onNavigate?: (screenName: string) => void;
}

export default function RoleDrawer({ role, open, onClose, onNavigate }: RoleDrawerProps) {
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuth();
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: DRAWER_WIDTH, duration: 200, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [open]);

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  const handleItemPress = (item: DrawerItem) => {
    if (item.action === 'logout') {
      void handleLogout();
      return;
    }
    if (item.screenName && onNavigate) {
      onNavigate(item.screenName);
      onClose();
    }
  };

  const sections = drawerConfig[role];

  return (
    <Modal transparent visible={open} onRequestClose={onClose} animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropAnim }]}
        pointerEvents={open ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer panel slides in from right */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.drawerHeader}>
          <View>
            <Text style={styles.drawerLabel}>Menu</Text>
            <Text style={styles.drawerTitle}>
              {user?.name ?? (role === 'customer' ? 'Customer' : 'Chef')} account
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            accessibilityLabel="Close menu"
          >
            <Ionicons name="close" size={22} color="#1a1a1a" />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {sections.map((section, idx) => (
            <View key={section.title}>
              <Text style={[styles.sectionTitle, idx === 0 && styles.sectionTitleFirst]}>
                {section.title}
              </Text>
              {section.items.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => handleItemPress(item)}
                  style={({ pressed }) => [
                    styles.itemRow,
                    pressed && styles.itemRowPressed,
                    item.action === 'logout' && styles.itemRowLogout,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.action === 'logout' ? '#ef4444' : '#6b7280'}
                    style={styles.itemIcon}
                  />
                  <Text style={[styles.itemLabel, item.action === 'logout' && styles.itemLabelLogout]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
              {idx < sections.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 24,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  drawerLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#9ca3af',
    marginBottom: 2,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 22,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#9ca3af',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 6,
  },
  sectionTitleFirst: {
    paddingTop: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  itemRowPressed: {
    backgroundColor: '#f9fafb',
  },
  itemRowLogout: {},
  itemIcon: {
    marginRight: 14,
    width: 22,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  itemLabelLogout: {
    color: '#ef4444',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
    marginTop: 12,
  },
});
