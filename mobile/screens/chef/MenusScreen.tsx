import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useChefMenus, useCreateWeeklyMenu } from '../../hooks/useMenus';
import type { ChefScreenProps } from '../../navigation/types';
import type { WeeklyMenuSummary } from '../../types/menu';
import { getMenuScopeLabel } from '../../utils/getMenuScopeLabel';
import { Ionicons } from '@expo/vector-icons';

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'bg-eplate-lightgray', text: 'text-eplate-darkgray' },
  published: { bg: 'bg-green-100', text: 'text-green-700' },
  archived: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

function MenuCard({
  menu,
  onEdit,
}: {
  menu: WeeklyMenuSummary;
  onEdit: () => void;
}) {
  const badge = STATUS_BADGE[menu.status] ?? STATUS_BADGE.draft;
  return (
    <Pressable
      className="bg-white border border-eplate-lightgray rounded-2xl p-4 mb-3"
      onPress={onEdit}
    >
      <View className="flex-row justify-between items-start">
        <Text className="text-base font-bold text-eplate-charcoal flex-1" numberOfLines={1}>
          {menu.title || 'Untitled Menu'}
        </Text>
        <View className={`px-2 py-0.5 rounded-full ml-2 ${badge.bg}`}>
          <Text className={`text-xs font-semibold capitalize ${badge.text}`}>
            {menu.status}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-3 mt-2">
        <Text className="text-sm text-eplate-midgray">{menu.duration_days} days</Text>
        <Text className="text-sm text-eplate-midgray">{getMenuScopeLabel(menu.menu_scope)}</Text>
        <Text className="text-sm font-semibold text-eplate-darkgray">${menu.base_price}</Text>
      </View>
    </Pressable>
  );
}

export default function MenusScreen({ navigation }: ChefScreenProps<'Menus'>) {
  const { data: menus, isLoading, isError } = useChefMenus();
  const createMenu = useCreateWeeklyMenu();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row gap-4 mr-2">
          <Pressable onPress={() => navigation.navigate('Tickets')}>
            <Ionicons name="receipt-outline" size={22} color="#2b322a" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('ChefProfile')}>
            <Ionicons name="person-outline" size={22} color="#2b322a" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  async function handleCreate() {
    try {
      const menu = await createMenu.mutateAsync({});
      navigation.navigate('MenuBuilder', { menuId: String(menu.id) });
    } catch {}
  }

  const sorted = menus
    ? [...menus].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    : [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#038568" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-eplate-offwhite">
      <View className="px-4 pt-4 pb-2 flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-bold text-eplate-charcoal">Weekly Menus</Text>
          <Text className="text-sm text-eplate-midgray">
            Create and manage your menu bundles.
          </Text>
        </View>
        <Pressable
          className="bg-eplate-charcoal px-4 py-2 rounded-xl"
          onPress={handleCreate}
        >
          <Text className="text-white font-semibold text-sm">New Menu</Text>
        </Pressable>
      </View>

      {sorted.length > 3 && (
        <Pressable
          className="mx-4 mb-2"
          onPress={() => navigation.navigate('AllMenus')}
        >
          <Text className="text-eplate-gold font-semibold text-sm">View All Menus</Text>
        </Pressable>
      )}

      {isError && (
        <View className="mx-4 p-3 bg-red-50 rounded-xl">
          <Text className="text-sm text-red-600">Could not load menus.</Text>
        </View>
      )}

      {!isError && sorted.length === 0 && (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="restaurant-outline" size={48} color="#e8e9e4" />
          <Text className="text-lg font-semibold text-eplate-charcoal mt-3">No menus yet</Text>
          <Text className="text-sm text-eplate-midgray mt-1 text-center">
            Create your first weekly menu to start receiving orders.
          </Text>
          <Pressable className="bg-eplate-charcoal px-6 py-3 rounded-xl mt-4" onPress={handleCreate}>
            <Text className="text-white font-semibold">Create First Menu</Text>
          </Pressable>
        </View>
      )}

      {sorted.length > 0 && (
        <FlatList
          contentContainerClassName="px-4 pt-2 pb-20"
          data={sorted.slice(0, 3)}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <MenuCard
              menu={item}
              onEdit={() => navigation.navigate('MenuBuilder', { menuId: String(item.id) })}
            />
          )}
        />
      )}
    </View>
  );
}
