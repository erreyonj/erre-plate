import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useBrowseFilters } from '../../hooks/useBrowseFilters';
import { useBrowseChefsQuery } from '../../hooks/useProfiles';
import type { CustomerScreenProps } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import BrowseCard from '../../components/chef/BrowseCard';

export default function BrowseScreen({ navigation }: CustomerScreenProps<'Browse'>) {
  const { filters } = useBrowseFilters();
  const { data, isLoading } = useBrowseChefsQuery(filters);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row gap-4 mr-2">
          <Pressable onPress={() => navigation.navigate('Orders')}>
            <Ionicons name="receipt-outline" size={22} color="#2b322a" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('CustomerProfile')}>
            <Ionicons name="person-outline" size={22} color="#2b322a" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#038568" />
        <Text className="text-eplate-midgray mt-3">Finding chefs near you...</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="search" size={48} color="#e8e9e4" />
        <Text className="text-lg font-semibold text-eplate-charcoal mt-4">No chefs found</Text>
        <Text className="text-sm text-eplate-midgray mt-1 text-center">
          Try adjusting your filters or check back later.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      className="bg-eplate-offwhite"
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
