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
  draft: { bg: 'bg-eplate-lightgray', text: 'text-eplate-darkgray' },
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
        <ActivityIndicator size="large" color="#038568" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-eplate-offwhite">
      <View className="flex-row gap-2 px-4 py-3">
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            className={`px-3 py-1.5 rounded-full ${
              statusFilter === f.value ? 'bg-eplate-charcoal' : 'bg-eplate-lightgray'
            }`}
            onPress={() => setStatusFilter(f.value)}
          >
            <Text
              className={`text-sm font-semibold ${
                statusFilter === f.value ? 'text-white' : 'text-eplate-darkgray'
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
              className="bg-white border border-eplate-lightgray rounded-2xl p-4 mb-3"
              onPress={() => navigation.navigate('MenuBuilder', { menuId: String(item.id) })}
            >
              <View className="flex-row justify-between items-start">
                <Text className="text-base font-bold text-eplate-charcoal flex-1" numberOfLines={1}>
                  {item.title || 'Untitled Menu'}
                </Text>
                <View className={`px-2 py-0.5 rounded-full ml-2 ${badge.bg}`}>
                  <Text className={`text-xs font-semibold capitalize ${badge.text}`}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3 mt-2">
                <Text className="text-sm text-eplate-midgray">{item.duration_days} days</Text>
                <Text className="text-sm text-eplate-midgray">{getMenuScopeLabel(item.menu_scope)}</Text>
                <Text className="text-sm font-semibold text-eplate-darkgray">${item.base_price}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-eplate-midgray">No menus match this filter.</Text>
          </View>
        }
      />
    </View>
  );
}
