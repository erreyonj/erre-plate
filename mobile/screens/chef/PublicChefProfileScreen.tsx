import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { usePublicChefProfile } from '../../hooks/useProfiles';
import type { CustomerScreenProps } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { getMenuScopeLabel } from '../../utils/getMenuScopeLabel';
import type { WeeklyMenuSummary, PublicWeeklyMenu } from '../../types/menu';

function HeroSection({ chef }: { chef: any }) {
  const name = `${chef.first_name} ${chef.last_name}`.trim();
  return (
    <View className="items-center mb-6">
      {chef.photo_url ? (
        <Image source={{ uri: chef.photo_url }} className="w-24 h-24 rounded-full" />
      ) : (
        <View className="w-24 h-24 rounded-full bg-eplate-charcoal items-center justify-center">
          <Text className="text-white text-3xl font-bold">{name.charAt(0)}</Text>
        </View>
      )}
      <Text className="text-2xl font-bold text-eplate-charcoal mt-3">{name}</Text>
      {chef.tagline && (
        <Text className="text-sm text-eplate-midgray mt-1 text-center px-4">{chef.tagline}</Text>
      )}
      <View className="flex-row items-center gap-4 mt-3">
        <View className="flex-row items-center gap-1">
          <Ionicons name="star" size={16} color="#f1b84d" />
          <Text className="text-sm font-semibold text-eplate-charcoal">
            {Number(chef.rating_average).toFixed(1)} ({chef.rating_count})
          </Text>
        </View>
        {chef.is_available && (
          <View className="bg-green-100 px-2.5 py-0.5 rounded-full">
            <Text className="text-xs font-semibold text-green-700">Available</Text>
          </View>
        )}
      </View>
      {chef.specialties && chef.specialties.length > 0 && (
        <View className="flex-row flex-wrap justify-center gap-2 mt-3 px-4">
          {chef.specialties.map((s: string) => (
            <View key={s} className="bg-eplate-lightgray px-2.5 py-1 rounded-full">
              <Text className="text-xs font-medium text-eplate-darkgray">{s}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function FeaturedMenuSection({
  menu,
  onOrder,
}: {
  menu: PublicWeeklyMenu;
  onOrder: () => void;
}) {
  return (
    <View className="border border-eplate-lightgray rounded-2xl p-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-eplate-charcoal">{menu.title}</Text>
        <View className="bg-eplate-gold-subtle px-2 py-0.5 rounded-full">
          <Text className="text-xs font-semibold text-eplate-brown">Featured</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-3 mb-3">
        <Text className="text-sm text-eplate-midgray">{menu.duration_days} days</Text>
        <Text className="text-sm text-eplate-midgray">{getMenuScopeLabel(menu.menu_scope)}</Text>
        <Text className="text-sm font-bold text-eplate-charcoal">${menu.base_price}</Text>
      </View>
      {menu.dishes && menu.dishes.length > 0 && (
        <View className="mb-3">
          {menu.dishes.slice(0, 3).map((dish) => (
            <Text key={dish.id} className="text-sm text-eplate-darkgray mb-0.5">
              {dish.name}
            </Text>
          ))}
          {menu.dishes.length > 3 && (
            <Text className="text-xs text-eplate-midgray">
              +{menu.dishes.length - 3} more dishes
            </Text>
          )}
        </View>
      )}
      <Pressable className="bg-eplate-charcoal rounded-xl py-3 items-center" onPress={onOrder}>
        <Text className="text-white font-semibold">Order This Menu</Text>
      </Pressable>
    </View>
  );
}

function MenuListSection({ menus }: { menus: WeeklyMenuSummary[] }) {
  if (!menus.length) return null;
  return (
    <View className="mb-4">
      <Text className="text-lg font-bold text-eplate-charcoal mb-3">Weekly Menus</Text>
      {menus.map((menu) => (
        <View key={menu.id} className="border border-eplate-lightgray rounded-xl p-3 mb-2">
          <Text className="text-sm font-bold text-eplate-charcoal">{menu.title}</Text>
          <View className="flex-row items-center gap-3 mt-1">
            <Text className="text-xs text-eplate-midgray">{menu.duration_days} days</Text>
            <Text className="text-xs text-eplate-midgray">{getMenuScopeLabel(menu.menu_scope)}</Text>
            <Text className="text-xs font-semibold text-eplate-darkgray">${menu.base_price}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function PublicChefProfileScreen({
  route,
  navigation,
}: CustomerScreenProps<'PublicChefProfile'>) {
  const { slug } = route.params;
  const { data, isLoading } = usePublicChefProfile(slug);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#038568" />
      </View>
    );
  }

  if (!data?.chef) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Ionicons name="alert-circle-outline" size={48} color="#e8e9e4" />
        <Text className="text-lg font-semibold text-eplate-charcoal mt-3">Chef not found</Text>
      </View>
    );
  }

  const { chef, featured_menu, weekly_menus } = data;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="px-4 py-4 pb-20">
      <HeroSection chef={chef} />

      {chef.bio && (
        <View className="mb-6">
          <Text className="text-base font-bold text-eplate-charcoal mb-2">About</Text>
          <Text className="text-sm text-eplate-darkgray leading-5">{chef.bio}</Text>
        </View>
      )}

      {!weekly_menus?.length && !featured_menu && (
        <View className="border border-dashed border-eplate-lightgray rounded-2xl p-6 items-center mb-4">
          <Ionicons name="restaurant-outline" size={32} color="#9a9d95" />
          <Text className="text-sm font-semibold text-eplate-darkgray mt-2">
            Menus coming soon
          </Text>
          <Text className="text-xs text-eplate-midgray mt-1 text-center">
            This chef is still preparing their weekly menus.
          </Text>
        </View>
      )}

      {featured_menu && (
        <FeaturedMenuSection
          menu={featured_menu}
          onOrder={() =>
            navigation.navigate('OrderBuilder', { slug: chef.slug ?? String(chef.id) })
          }
        />
      )}

      {weekly_menus && <MenuListSection menus={weekly_menus} />}

      <Pressable
        className="bg-eplate-charcoal rounded-xl py-3.5 items-center mt-4"
        onPress={() =>
          navigation.navigate('OrderBuilder', { slug: chef.slug ?? String(chef.id) })
        }
      >
        <Text className="text-white font-semibold text-base">Order from Chef</Text>
      </Pressable>
    </ScrollView>
  );
}
