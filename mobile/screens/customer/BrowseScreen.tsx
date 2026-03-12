import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Image } from 'react-native';
import { useBrowseFilters } from '../../hooks/useBrowseFilters';
import { useBrowseChefsQuery } from '../../hooks/useProfiles';
import type { CustomerScreenProps } from '../../navigation/types';
import type { PublicChefProfile } from '../../types/profile';
import { Ionicons } from '@expo/vector-icons';

function BrowseCard({ chef, onPress }: { chef: PublicChefProfile; onPress: () => void }) {
  const name = `${chef.first_name} ${chef.last_name}`.trim();
  return (
    <Pressable
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3"
      onPress={onPress}
    >
      {chef.photo_url ? (
        <Image
          source={{ uri: chef.photo_url }}
          className="w-full h-40"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-40 bg-gray-200 items-center justify-center">
          <Ionicons name="restaurant" size={40} color="#9ca3af" />
        </View>
      )}
      <View className="p-3">
        <Text className="text-base font-bold text-gray-900">{name}</Text>
        {chef.tagline && (
          <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
            {chef.tagline}
          </Text>
        )}
        <View className="flex-row items-center mt-2 gap-3">
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text className="text-sm font-semibold text-gray-700">
              {Number(chef.rating_average).toFixed(1)}
            </Text>
          </View>
          {chef.is_available && (
            <View className="bg-green-100 px-2 py-0.5 rounded-full">
              <Text className="text-xs font-semibold text-green-700">Available</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function BrowseScreen({ navigation }: CustomerScreenProps<'Browse'>) {
  const { filters } = useBrowseFilters();
  const { data, isLoading } = useBrowseChefsQuery(filters);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row gap-4 mr-2">
          <Pressable onPress={() => navigation.navigate('Orders')}>
            <Ionicons name="receipt-outline" size={22} color="#111827" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('CustomerProfile')}>
            <Ionicons name="person-outline" size={22} color="#111827" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="text-gray-500 mt-3">Finding chefs near you...</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="search" size={48} color="#d1d5db" />
        <Text className="text-lg font-semibold text-gray-800 mt-4">No chefs found</Text>
        <Text className="text-sm text-gray-500 mt-1 text-center">
          Try adjusting your filters or check back later.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      className="bg-gray-50"
      contentContainerClassName="px-4 pt-4 pb-20"
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <BrowseCard
          chef={item}
          onPress={() =>
            navigation.navigate('PublicChefProfile', {
              slug: item.slug ?? String(item.id),
            })
          }
        />
      )}
    />
  );
}
