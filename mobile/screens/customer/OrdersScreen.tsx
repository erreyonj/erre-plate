import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useOrdersQuery } from '../../hooks/useOrders';
import type { CustomerScreenProps } from '../../navigation/types';
import type { OrderSummary } from '../../types/order';
import { Ionicons } from '@expo/vector-icons';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-indigo-100 text-indigo-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

function OrderCard({ order, onPress }: { order: OrderSummary; onPress: () => void }) {
  const colorClass = STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600';
  const [bgClass, textClass] = colorClass.split(' ');

  return (
    <Pressable
      className="bg-white rounded-2xl border border-gray-100 p-4 mb-3"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">
            {order.menu_name ?? 'Weekly Menu'}
          </Text>
          {order.chef_name && (
            <Text className="text-sm text-gray-500 mt-0.5">by {order.chef_name}</Text>
          )}
        </View>
        <View className={`px-2.5 py-1 rounded-full ${bgClass}`}>
          <Text className={`text-xs font-semibold capitalize ${textClass}`}>
            {order.status}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-sm text-gray-500">
          {order.placed_at
            ? new Date(order.placed_at).toLocaleDateString()
            : 'Pending'}
        </Text>
        <Text className="text-base font-bold text-gray-900">
          ${order.total}
        </Text>
      </View>
    </Pressable>
  );
}

export default function OrdersScreen({ navigation }: CustomerScreenProps<'Orders'>) {
  const { data: orders, isLoading, isError } = useOrdersQuery();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">Could not load orders.</Text>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center mb-3">
          <Ionicons name="receipt-outline" size={24} color="#9ca3af" />
        </View>
        <Text className="text-lg font-semibold text-gray-800">No orders yet</Text>
        <Text className="text-sm text-gray-500 mt-1 text-center">
          Browse chefs and place your first order!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      className="bg-gray-50"
      contentContainerClassName="px-4 pt-4 pb-20"
      data={orders}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <OrderCard
          order={item}
          onPress={() => navigation.navigate('OrderDetail', { id: String(item.id) })}
        />
      )}
    />
  );
}
