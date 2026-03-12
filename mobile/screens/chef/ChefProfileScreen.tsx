import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import type { ChefScreenProps } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

function getDisplayName(user: any) {
  if (!user) return 'Chef';
  if (user.name) return user.name;
  return `${user.first_name} ${user.last_name}`.trim();
}

export default function ChefProfileScreen({ navigation }: ChefScreenProps<'ChefProfile'>) {
  const { user, logout } = useAuth();
  const displayName = getDisplayName(user);

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="px-4 py-4">
      <View className="items-center mb-6">
        {user?.photo_url ? (
          <Image source={{ uri: user.photo_url }} className="w-20 h-20 rounded-full" />
        ) : (
          <View className="w-20 h-20 rounded-full bg-eplate-charcoal items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text className="text-xl font-bold text-eplate-charcoal mt-3">{displayName}</Text>
        <Text className="text-sm text-eplate-midgray">{user?.email}</Text>
      </View>

      <Pressable
        className="flex-row items-center justify-between bg-white border border-eplate-lightgray rounded-2xl p-4 mb-3"
        onPress={() => navigation.navigate('ChefProfileEdit')}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="person-outline" size={20} color="#4a5248" />
          <Text className="text-base text-eplate-charcoal">Edit Profile</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9a9d95" />
      </Pressable>

      <Pressable
        className="flex-row items-center justify-between bg-white border border-eplate-lightgray rounded-2xl p-4 mb-3"
        onPress={() => navigation.navigate('Menus')}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="restaurant-outline" size={20} color="#4a5248" />
          <Text className="text-base text-eplate-charcoal">My Menus</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9a9d95" />
      </Pressable>

      <Pressable
        className="flex-row items-center justify-between bg-white border border-eplate-lightgray rounded-2xl p-4 mb-3"
        onPress={() => navigation.navigate('Tickets')}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="receipt-outline" size={20} color="#4a5248" />
          <Text className="text-base text-eplate-charcoal">Orders</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9a9d95" />
      </Pressable>

      <Pressable
        className="flex-row items-center justify-between bg-white border border-red-100 rounded-2xl p-4 mt-6"
        onPress={logout}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text className="text-base text-red-600">Sign Out</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}
