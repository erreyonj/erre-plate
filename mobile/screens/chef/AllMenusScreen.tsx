import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useChefMenus } from '../../hooks/useMenus';
import type { ChefScreenProps } from '../../navigation/types';
import type { MenuStatus, WeeklyMenuSummary } from '../../types/menu';
import { getMenuScopeLabel } from '../../utils/getMenuScopeLabel';

const FILTERS: { label: string; value: MenuStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-600' },
  published: { bg: 'bg-green-100', text: 'text-green-700' },
  archived: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

export default function AllMenusScreen({ navigation }: ChefScreenProps<'AllMenus'>) {
  const { data: menus, isLoading } = useChefMenus();
  const [statusFilter, setStatusFilter] = useState<MenuStatus | 'all'>('all');

  const filtered = useMemo(() => {
    if (!menus) return [];
    const sorted = [...menus].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (statusFilter === 'all') return sorted;
    return sorted.filter((m) => m.status === statusFilter);
  }, [menus, statusFilter]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row gap-2 px-4 py-3">
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            className={`px-3 py-1.5 rounded-full ${
              statusFilter === f.value ? 'bg-gray-900' : 'bg-gray-100'
            }`}
            onPress={() => setStatusFilter(f.value)}
          >
            <Text
              className={`text-sm font-semibold ${
                statusFilter === f.value ? 'text-white' : 'text-gray-600'
              }`}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        contentContainerClassName="px-4 pb-20"
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const badge = STATUS_BADGE[item.status] ?? STATUS_BADGE.draft;
          return (
            <Pressable
              className="bg-white border border-gray-100 rounded-2xl p-4 mb-3"
              onPress={() => navigation.navigate('MenuBuilder', { menuId: String(item.id) })}
            >
              <View className="flex-row justify-between items-start">
                <Text className="text-base font-bold text-gray-900 flex-1" numberOfLines={1}>
                  {item.title || 'Untitled Menu'}
                </Text>
                <View className={`px-2 py-0.5 rounded-full ml-2 ${badge.bg}`}>
                  <Text className={`text-xs font-semibold capitalize ${badge.text}`}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3 mt-2">
                <Text className="text-sm text-gray-500">{item.duration_days} days</Text>
                <Text className="text-sm text-gray-500">{getMenuScopeLabel(item.menu_scope)}</Text>
                <Text className="text-sm font-semibold text-gray-700">${item.base_price}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-gray-500">No menus match this filter.</Text>
          </View>
        }
      />
    </View>
  );
}
