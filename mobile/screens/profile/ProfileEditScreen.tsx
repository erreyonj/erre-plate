import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateProfileMutation, useUploadProfilePhoto } from '../../hooks/useProfiles';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileEditScreen() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfileMutation();
  const uploadPhoto = useUploadProfilePhoto();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    dietary_preferences: '',
    allergies: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        phone: user.phone ?? '',
        dietary_preferences: user.dietary_preferences ?? '',
        allergies: user.allergies ?? '',
        street: user.address?.street ?? '',
        city: user.address?.city ?? '',
        state: user.address?.state ?? '',
        zip: user.address?.zip ?? '',
      });
    }
  }, [user]);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    try {
      await updateProfile.mutateAsync({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || null,
        dietary_preferences: form.dietary_preferences || null,
        allergies: form.allergies || null,
        role: user?.role as 'customer' | 'chef',
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
      });
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Could not update profile.');
    }
  }

  async function handlePickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        await uploadPhoto.mutateAsync(result.assets[0].uri);
        Alert.alert('Success', 'Photo updated.');
      } catch {
        Alert.alert('Error', 'Could not upload photo.');
      }
    }
  }

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerClassName="px-4 py-4 pb-20" keyboardShouldPersistTaps="handled">
        <View className="items-center mb-6">
          {user.photo_url ? (
            <Image source={{ uri: user.photo_url }} className="w-20 h-20 rounded-full" />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center">
              <Text className="text-2xl font-bold text-gray-500">
                {form.first_name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Pressable className="mt-2" onPress={handlePickPhoto}>
            <Text className="text-amber-600 font-semibold text-sm">
              {uploadPhoto.isPending ? 'Uploading...' : 'Change Photo'}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">First name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
              value={form.first_name}
              onChangeText={(v) => update('first_name', v)}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">Last name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
              value={form.last_name}
              onChangeText={(v) => update('last_name', v)}
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Phone</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
            value={form.phone}
            onChangeText={(v) => update('phone', v)}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Street</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
            value={form.street}
            onChangeText={(v) => update('street', v)}
          />
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">City</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
              value={form.city}
              onChangeText={(v) => update('city', v)}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">ZIP</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
              value={form.zip}
              onChangeText={(v) => update('zip', v)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Dietary Preferences</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
            value={form.dietary_preferences}
            onChangeText={(v) => update('dietary_preferences', v)}
            placeholder="e.g. Vegetarian, Gluten-free"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-1">Allergies</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
            value={form.allergies}
            onChangeText={(v) => update('allergies', v)}
            placeholder="e.g. Peanuts, Shellfish"
          />
        </View>

        <Pressable
          className={`rounded-xl py-3.5 items-center ${
            updateProfile.isPending ? 'bg-gray-400' : 'bg-gray-900'
          }`}
          onPress={handleSave}
          disabled={updateProfile.isPending}
        >
          <Text className="text-white font-semibold text-base">
            {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
