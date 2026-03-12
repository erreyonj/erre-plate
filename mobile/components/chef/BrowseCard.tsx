import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import type { PublicChefProfile } from '../../types/profile';

type BrowseCardProps = {
  chef: PublicChefProfile;
  onPress: () => void;
};

export default function BrowseCard({ chef, onPress }: BrowseCardProps) {
  const fullName = `${chef.first_name} ${chef.last_name}`.trim();

  const rating = Number(chef.rating_average || 0);
  const hourlyRate = Number(chef.hourly_rate);

  const availabilityLabel = chef.is_available
    ? `Available · Order by ${chef.cutoff_day.slice(0, 3)}`
    : 'Currently Unavailable';

  return (
    <Pressable
      className="bg-white rounded-2xl border border-eplate-lightgray overflow-hidden mb-3"
      onPress={onPress}
    >
      {/* Header band */}
      <View className="h-20 bg-eplate-lightgray items-center justify-center">
        <View className="w-16 h-16 rounded-xl bg-eplate-turquoise items-center justify-center overflow-hidden">
          {chef.photo_url ? (
            <Image
              source={{ uri: chef.photo_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="restaurant" size={34} color="#fff" />
          )}
        </View>
      </View>

      {/* Content */}
      <View className="px-3 pt-2 pb-3">
        <Text className="text-base font-extrabold text-eplate-charcoal" numberOfLines={1}>
          {fullName || 'Private Chef'}
        </Text>

        {/* Rating */}
        <View className="flex-row items-center gap-1 mt-1">
          <Text className="text-sm font-bold text-eplate-charcoal">
            {rating.toFixed(1)}
          </Text>
          <Ionicons name="star" size={14} color={colors.gold} />
          <Text className="text-xs text-eplate-midgray">({chef.rating_count})</Text>
        </View>

        {/* Pricing */}
        <Text className="text-xs text-eplate-darkgray mt-1">
          From{' '}
          <Text className="font-extrabold text-eplate-charcoal">${hourlyRate}</Text>
          {' '}/ hr
        </Text>

        {/* Specialties */}
        {chef.specialties && chef.specialties.length > 0 && (
          <Text className="text-xs text-eplate-midgray mt-1" numberOfLines={1}>
            {chef.specialties.slice(0, 2).join(' · ')}
          </Text>
        )}

        {/* Availability chip */}
        <View
          className={`mt-2.5 rounded-full py-1 items-center ${
            chef.is_available ? 'bg-eplate-turquoise' : 'bg-eplate-lightgray'
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              chef.is_available ? 'text-white' : 'text-eplate-charcoal'
            }`}
          >
            {availabilityLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
