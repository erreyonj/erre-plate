/**
 * CustomerLayout — mobile equivalent of CustomerLayout.tsx + MobileLayout.tsx
 *
 * Structure:
 *   AppHeader (fixed top, logo + hamburger)
 *   BottomTabNavigator
 *     BrowseTab  → BrowseStack  (Browse → PublicChefProfile → OrderBuilder)
 *     OrdersTab  → OrdersStack  (Orders → OrderDetail)
 *     ProfileTab → ProfileStack (CustomerProfile → ProfileEdit)
 *   RoleBottomTabBar (floating pill, absolute over content)
 *   RoleDrawer (full-screen modal, slides from right)
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppHeader from '../../components/layout/AppHeader';
import RoleBottomTabBar from '../../components/layout/RoleBottomTabBar';
import RoleDrawer from '../../components/layout/RoleDrawer';

import BrowseScreen from '../customer/BrowseScreen';
import PublicChefProfileScreen from '../chef/PublicChefProfileScreen';
import OrderBuilderScreen from '../customer/OrderBuilderScreen';
import OrdersScreen from '../customer/OrdersScreen';
import OrderDetailScreen from '../customer/OrderDetailScreen';
import CustomerProfileScreen from '../customer/CustomerProfileScreen';
import ProfileEditScreen from '../profile/ProfileEditScreen';

import type {
  CustomerTabParamList,
  CustomerBrowseStackParamList,
  CustomerOrdersStackParamList,
  CustomerProfileStackParamList,
} from '../../navigation/types';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const BrowseStack = createNativeStackNavigator<CustomerBrowseStackParamList>();
const OrdersStack = createNativeStackNavigator<CustomerOrdersStackParamList>();
const ProfileStack = createNativeStackNavigator<CustomerProfileStackParamList>();

function BrowseNavigator() {
  return (
    <BrowseStack.Navigator screenOptions={{ headerShown: false }}>
      <BrowseStack.Screen name="Browse" component={BrowseScreen} />
      <BrowseStack.Screen name="PublicChefProfile" component={PublicChefProfileScreen} />
      <BrowseStack.Screen name="OrderBuilder" component={OrderBuilderScreen} />
    </BrowseStack.Navigator>
  );
}

function OrdersNavigator() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="Orders" component={OrdersScreen} />
      <OrdersStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrdersStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="CustomerProfile" component={CustomerProfileScreen} />
      <ProfileStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
    </ProfileStack.Navigator>
  );
}

export default function CustomerLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <View style={styles.root}>
      <AppHeader onOpenDrawer={openDrawer} />

      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <RoleBottomTabBar {...props} role="customer" />}
      >
        <Tab.Screen
          name="BrowseTab"
          component={BrowseNavigator}
          options={{ tabBarAccessibilityLabel: 'Browse' }}
        />
        <Tab.Screen
          name="OrdersTab"
          component={OrdersNavigator}
          options={{ tabBarAccessibilityLabel: 'Orders' }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileNavigator}
          options={{ tabBarAccessibilityLabel: 'Profile' }}
        />
      </Tab.Navigator>

      <RoleDrawer role="customer" open={drawerOpen} onClose={closeDrawer} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
