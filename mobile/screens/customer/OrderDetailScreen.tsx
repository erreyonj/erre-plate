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
  completed: 'bg-eplate-lightgray text-eplate-darkgray',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailScreen({ route }: CustomerScreenProps<'OrderDetail'>) {
  const { id } = route.params;
  const { data: order, isLoading, isError } = useOrderQuery(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#038568" />
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
  const colorClass = STATUS_COLORS[order.status] ?? 'bg-eplate-lightgray text-eplate-darkgray';
  const [bgClass, textClass] = colorClass.split(' ');

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="px-4 py-4">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className="text-xl font-bold text-eplate-charcoal">
            {menu?.menu_name ?? 'Weekly Menu'}
          </Text>
          <Text className="text-sm text-eplate-midgray mt-0.5">by {chefName}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${bgClass}`}>
          <Text className={`text-xs font-semibold capitalize ${textClass}`}>
            {order.status}
          </Text>
        </View>
      </View>

      {menu && menu.items.length > 0 && (
        <View className="border border-eplate-lightgray rounded-2xl p-4 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="restaurant" size={16} color="#9a9d95" />
            <Text className="text-sm font-bold text-eplate-darkgray">Menu Items</Text>
          </View>
          {menu.items.map((item) => (
            <View key={item.id} className="mb-2">
              <Text className="text-sm font-semibold text-eplate-charcoal">{item.dish_name}</Text>
              {item.dish_description && (
                <Text className="text-xs text-eplate-midgray">{item.dish_description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View className="border border-eplate-lightgray rounded-2xl p-4 mb-4">
        <Text className="text-sm font-bold text-eplate-darkgray mb-3">Order Summary</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-eplate-midgray">Subtotal</Text>
          <Text className="text-sm text-eplate-charcoal">${order.subtotal}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-eplate-midgray">Platform fee</Text>
          <Text className="text-sm text-eplate-charcoal">${order.platform_fee}</Text>
        </View>
        {parseFloat(order.tax) > 0 && (
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm text-eplate-midgray">Tax</Text>
            <Text className="text-sm text-eplate-charcoal">${order.tax}</Text>
          </View>
        )}
        <View className="border-t border-eplate-lightgray mt-2 pt-2 flex-row justify-between">
          <Text className="text-sm font-bold text-eplate-charcoal">Total</Text>
          <Text className="text-sm font-bold text-eplate-charcoal">
            ${order.total} {order.currency}
          </Text>
        </View>
      </View>

      {order.delivery_date && (
        <View className="border border-eplate-lightgray rounded-2xl p-4 mb-4">
          <Text className="text-sm font-bold text-eplate-darkgray mb-2">Delivery</Text>
          <Text className="text-sm text-eplate-midgray">
            {new Date(order.delivery_date).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          {order.delivery_address && (
            <Text className="text-sm text-eplate-midgray mt-1">
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
        <View className="border border-eplate-lightgray rounded-2xl p-4">
          <Text className="text-sm font-bold text-eplate-darkgray mb-3">Status History</Text>
          {order.status_history.map((event) => (
            <View key={event.id} className="flex-row items-start mb-2">
              <View className="w-2 h-2 rounded-full bg-eplate-midgray mt-1.5 mr-3" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-eplate-charcoal capitalize">
                  {event.status}
                </Text>
                <Text className="text-xs text-eplate-midgray">
                  {new Date(event.created_at).toLocaleString()}
                </Text>
                {event.note && (
                  <Text className="text-xs text-eplate-midgray mt-0.5">{event.note}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
