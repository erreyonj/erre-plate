import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { usePublicChefProfile } from '../../hooks/useProfiles';
import { usePublicMenuDetail } from '../../hooks/useMenus';
import { useCreateOrderMutation } from '../../hooks/useOrders';
import type { CustomerScreenProps } from '../../navigation/types';
import type { WeeklyMenuSummary } from '../../types/menu';
import { getMenuScopeLabel } from '../../utils/getMenuScopeLabel';

export default function OrderBuilderScreen({
  route,
  navigation,
}: CustomerScreenProps<'OrderBuilder'>) {
  const { slug } = route.params;
  const { data, isLoading, isError } = usePublicChefProfile(slug);
  const createOrder = useCreateOrderMutation();
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#038568" />
        <Text className="text-eplate-midgray mt-3">Loading menu options...</Text>
      </View>
    );
  }

  if (isError || !data?.chef) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">Chef not found.</Text>
      </View>
    );
  }

  const { chef, featured_menu, weekly_menus } = data;
  const chefName = `${chef.first_name} ${chef.last_name}`.trim();

  const allMenus: WeeklyMenuSummary[] = [
    ...(featured_menu
      ? [
          {
            id: featured_menu.id,
            title: featured_menu.title,
            duration_days: featured_menu.duration_days,
            menu_scope: featured_menu.menu_scope,
            required_meal_count: featured_menu.required_meal_count ?? 0,
            base_price: featured_menu.base_price,
            status: featured_menu.status,
            created_at: '',
            updated_at: '',
          } satisfies WeeklyMenuSummary,
        ]
      : []),
    ...(weekly_menus ?? []),
  ];

  async function handlePlaceOrder() {
    if (!selectedMenuId) {
      Alert.alert('Select a menu', 'Please select a menu to order.');
      return;
    }
    try {
      await createOrder.mutateAsync({
        weekly_menu_id: selectedMenuId,
        notes: notes || undefined,
      });
      Alert.alert('Order Placed', 'Your order has been placed successfully!', [
        { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Could not place order.');
    }
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="px-4 py-4">
      <Text className="text-xl font-bold text-eplate-charcoal mb-1">Order from {chefName}</Text>
      <Text className="text-sm text-eplate-midgray mb-6">Select a weekly menu to order</Text>

      {allMenus.map((menu) => (
        <Pressable
          key={menu.id}
          className={`border rounded-2xl p-4 mb-3 ${
            selectedMenuId === menu.id ? 'border-eplate-gold bg-eplate-gold-subtle' : 'border-eplate-lightgray'
          }`}
          onPress={() => setSelectedMenuId(menu.id)}
        >
          <Text className="text-base font-bold text-eplate-charcoal">{menu.title}</Text>
          <View className="flex-row items-center gap-3 mt-2">
            <Text className="text-sm text-eplate-midgray">
              {menu.duration_days} days
            </Text>
            <Text className="text-sm text-eplate-midgray">
              {getMenuScopeLabel(menu.menu_scope)}
            </Text>
            <Text className="text-sm font-semibold text-eplate-charcoal">
              ${menu.base_price}
            </Text>
          </View>
        </Pressable>
      ))}

      <View className="mt-4 mb-4">
        <Text className="text-sm font-medium text-eplate-darkgray mb-1">
          Notes (optional)
        </Text>
        <TextInput
          className="border border-eplate-lightgray rounded-xl px-4 py-3 text-base bg-eplate-offwhite min-h-[80px]"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any dietary notes or delivery instructions..."
          multiline
          textAlignVertical="top"
        />
      </View>

      <Pressable
        className={`rounded-xl py-3.5 items-center ${
          !selectedMenuId || createOrder.isPending ? 'bg-eplate-midgray' : 'bg-eplate-charcoal'
        }`}
        onPress={handlePlaceOrder}
        disabled={!selectedMenuId || createOrder.isPending}
      >
        <Text className="text-white font-semibold text-base">
          {createOrder.isPending ? 'Placing order...' : 'Place Order'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
