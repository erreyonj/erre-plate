import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useOrderQuery } from '../../hooks/useOrders';
import type { CustomerScreenProps } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-indigo-100 text-indigo-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailScreen({ route }: CustomerScreenProps<'OrderDetail'>) {
  const { id } = route.params;
  const { data: order, isLoading, isError } = useOrderQuery(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">Order not found.</Text>
      </View>
    );
  }

  const menu = order.order_menu;
  const chefName = order.chef
    ? `${order.chef.first_name ?? ''} ${order.chef.last_name ?? ''}`.trim()
    : 'Chef';
  const colorClass = STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600';
  const [bgClass, textClass] = colorClass.split(' ');

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="px-4 py-4">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">
            {menu?.menu_name ?? 'Weekly Menu'}
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5">by {chefName}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${bgClass}`}>
          <Text className={`text-xs font-semibold capitalize ${textClass}`}>
            {order.status}
          </Text>
        </View>
      </View>

      {menu && menu.items.length > 0 && (
        <View className="border border-gray-100 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="restaurant" size={16} color="#6b7280" />
            <Text className="text-sm font-bold text-gray-800">Menu Items</Text>
          </View>
          {menu.items.map((item) => (
            <View key={item.id} className="mb-2">
              <Text className="text-sm font-semibold text-gray-900">{item.dish_name}</Text>
              {item.dish_description && (
                <Text className="text-xs text-gray-500">{item.dish_description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View className="border border-gray-100 rounded-2xl p-4 mb-4">
        <Text className="text-sm font-bold text-gray-800 mb-3">Order Summary</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-500">Subtotal</Text>
          <Text className="text-sm text-gray-900">${order.subtotal}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-500">Platform fee</Text>
          <Text className="text-sm text-gray-900">${order.platform_fee}</Text>
        </View>
        {parseFloat(order.tax) > 0 && (
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm text-gray-500">Tax</Text>
            <Text className="text-sm text-gray-900">${order.tax}</Text>
          </View>
        )}
        <View className="border-t border-gray-100 mt-2 pt-2 flex-row justify-between">
          <Text className="text-sm font-bold text-gray-900">Total</Text>
          <Text className="text-sm font-bold text-gray-900">
            ${order.total} {order.currency}
          </Text>
        </View>
      </View>

      {order.delivery_date && (
        <View className="border border-gray-100 rounded-2xl p-4 mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-2">Delivery</Text>
          <Text className="text-sm text-gray-500">
            {new Date(order.delivery_date).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          {order.delivery_address && (
            <Text className="text-sm text-gray-500 mt-1">
              {[
                order.delivery_address.street,
                order.delivery_address.city,
                order.delivery_address.state,
                order.delivery_address.zip,
              ]
                .filter(Boolean)
                .join(', ')}
            </Text>
          )}
        </View>
      )}

      {order.status_history.length > 0 && (
        <View className="border border-gray-100 rounded-2xl p-4">
          <Text className="text-sm font-bold text-gray-800 mb-3">Status History</Text>
          {order.status_history.map((event) => (
            <View key={event.id} className="flex-row items-start mb-2">
              <View className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 mr-3" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-900 capitalize">
                  {event.status}
                </Text>
                <Text className="text-xs text-gray-500">
                  {new Date(event.created_at).toLocaleString()}
                </Text>
                {event.note && (
                  <Text className="text-xs text-gray-500 mt-0.5">{event.note}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
