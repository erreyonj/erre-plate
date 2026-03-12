/**
 * ChefLayout — mobile equivalent of ChefLayout.tsx + MobileLayout.tsx
 *
 * Structure:
 *   AppHeader (fixed top, logo + hamburger)
 *   BottomTabNavigator
 *     MenusTab       → MenusStack   (Menus → AllMenus → MenuBuilder)
 *     TicketsTab     → TicketsStack (Tickets)
 *     ChefProfileTab → ProfileStack (ChefProfile → ChefProfileEdit)
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

import MenusScreen from '../chef/MenusScreen';
import AllMenusScreen from '../chef/AllMenusScreen';
import MenuBuilderScreen from '../chef/MenuBuilderScreen';
import TicketsScreen from '../chef/TicketsScreen';
import ChefProfileScreen from '../chef/ChefProfileScreen';
import ProfileEditScreen from '../profile/ProfileEditScreen';

import type {
  ChefTabParamList,
  ChefMenusStackParamList,
  ChefTicketsStackParamList,
  ChefProfileStackParamList,
} from '../../navigation/types';

const Tab = createBottomTabNavigator<ChefTabParamList>();
const MenusStack = createNativeStackNavigator<ChefMenusStackParamList>();
const TicketsStack = createNativeStackNavigator<ChefTicketsStackParamList>();
const ChefProfileStack = createNativeStackNavigator<ChefProfileStackParamList>();

function MenusNavigator() {
  return (
    <MenusStack.Navigator screenOptions={{ headerShown: false }}>
      <MenusStack.Screen name="Menus" component={MenusScreen} />
      <MenusStack.Screen name="AllMenus" component={AllMenusScreen} />
      <MenusStack.Screen name="MenuBuilder" component={MenuBuilderScreen} />
    </MenusStack.Navigator>
  );
}

function TicketsNavigator() {
  return (
    <TicketsStack.Navigator screenOptions={{ headerShown: false }}>
      <TicketsStack.Screen name="Tickets" component={TicketsScreen} />
    </TicketsStack.Navigator>
  );
}

function ChefProfileNavigator() {
  return (
    <ChefProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ChefProfileStack.Screen name="ChefProfile" component={ChefProfileScreen} />
      <ChefProfileStack.Screen name="ChefProfileEdit" component={ProfileEditScreen} />
    </ChefProfileStack.Navigator>
  );
}

export default function ChefLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <View style={styles.root}>
      <AppHeader onOpenDrawer={openDrawer} />

      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <RoleBottomTabBar {...props} role="chef" />}
      >
        <Tab.Screen
          name="MenusTab"
          component={MenusNavigator}
          options={{ tabBarAccessibilityLabel: 'Menus' }}
        />
        <Tab.Screen
          name="TicketsTab"
          component={TicketsNavigator}
          options={{ tabBarAccessibilityLabel: 'Orders' }}
        />
        <Tab.Screen
          name="ChefProfileTab"
          component={ChefProfileNavigator}
          options={{ tabBarAccessibilityLabel: 'Profile' }}
        />
      </Tab.Navigator>

      <RoleDrawer role="chef" open={drawerOpen} onClose={closeDrawer} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
