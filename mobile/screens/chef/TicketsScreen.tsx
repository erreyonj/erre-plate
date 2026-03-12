import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useChefOrdersQuery, useChefUpdateOrderStatusMutation } from '../../hooks/useOrders';
import type { ChefScreenProps } from '../../navigation/types';
import type { OrderSummary, OrderStatus } from '../../types/order';
import { Ionicons } from '@expo/vector-icons';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700' },
  preparing: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  ready: { bg: 'bg-green-100', text: 'text-green-700' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-600' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

function TicketCard({
  order,
  onAdvance,
}: {
  order: OrderSummary;
  onAdvance?: () => void;
}) {
  const colors = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
  const nextStatus = NEXT_STATUS[order.status];
  const isActive = !['completed', 'cancelled'].includes(order.status);

  return (
    <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">
            {order.menu_name ?? 'Order'}
          </Text>
          {order.chef_name && (
            <Text className="text-sm text-gray-500 mt-0.5">
              Customer order #{order.id}
            </Text>
          )}
        </View>
        <View className={`px-2.5 py-1 rounded-full ${colors.bg}`}>
          <Text className={`text-xs font-semibold capitalize ${colors.text}`}>
            {order.status}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-sm font-semibold text-gray-900">${order.total}</Text>
        {isActive && nextStatus && onAdvance && (
          <Pressable className="bg-gray-900 px-4 py-2 rounded-xl" onPress={onAdvance}>
            <Text className="text-white text-sm font-semibold capitalize">
              Mark {nextStatus}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function TicketsScreen({ navigation }: ChefScreenProps<'Tickets'>) {
  const { data: orders, isLoading, isError } = useChefOrdersQuery();
  const updateStatus = useChefUpdateOrderStatusMutation();

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
          Orders from customers will appear here.
        </Text>
      </View>
    );
  }

  const active = orders.filter((o) => !['completed', 'cancelled'].includes(o.status));
  const past = orders.filter((o) => ['completed', 'cancelled'].includes(o.status));

  return (
    <FlatList
      className="bg-gray-50"
      contentContainerClassName="px-4 pt-4 pb-20"
      data={[...active, ...past]}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => {
        const nextStatus = NEXT_STATUS[item.status];
        return (
          <TicketCard
            order={item}
            onAdvance={
              nextStatus
                ? () =>
                    updateStatus.mutate({
                      orderId: item.id,
                      status: nextStatus,
                    })
                : undefined
            }
          />
        );
      }}
      ListHeaderComponent={
        active.length > 0 ? (
          <Text className="text-lg font-bold text-gray-900 mb-3">Active Orders</Text>
        ) : null
      }
    />
  );
}
