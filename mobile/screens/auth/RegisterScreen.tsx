import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthScreenProps } from '../../navigation/types';

export default function RegisterScreen({ navigation }: AuthScreenProps<'Register'>) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer' as 'customer' | 'chef',
  });
  const [isLoading, setIsLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleRegister() {
    if (form.password !== form.password_confirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        role: form.role,
        address: {},
      });
    } catch (err: any) {
      Alert.alert('Registration Failed', err?.message ?? 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-eplate-offwhite"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="py-12 px-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-eplate-charcoal mb-2">
          Create account
        </Text>
        <Text className="text-base text-eplate-midgray mb-8">
          Join errePlate and start exploring
        </Text>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-eplate-darkgray mb-1">First name</Text>
            <TextInput
              className="border border-eplate-lightgray rounded-xl px-4 py-3 text-base bg-white"
              value={form.first_name}
              onChangeText={(v) => update('first_name', v)}
              autoComplete="given-name"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-eplate-darkgray mb-1">Last name</Text>
            <TextInput
              className="border border-eplate-lightgray rounded-xl px-4 py-3 text-base bg-white"
              value={form.last_name}
              onChangeText={(v) => update('last_name', v)}
              autoComplete="family-name"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-eplate-darkgray mb-1">Email</Text>
          <TextInput
            className="border border-eplate-lightgray rounded-xl px-4 py-3 text-base bg-white"
            value={form.email}
            onChangeText={(v) => update('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-eplate-darkgray mb-1">I am a</Text>
          <View className="flex-row gap-3">
            <Pressable
              className={`flex-1 rounded-xl py-3 items-center border ${form.role === 'customer' ? 'border-eplate-gold bg-eplate-gold-subtle' : 'border-eplate-lightgray bg-white'}`}
              onPress={() => update('role', 'customer')}
            >
              <Text className={form.role === 'customer' ? 'text-eplate-brown font-semibold' : 'text-eplate-midgray'}>
                Customer
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-xl py-3 items-center border ${form.role === 'chef' ? 'border-eplate-gold bg-eplate-gold-subtle' : 'border-eplate-lightgray bg-white'}`}
              onPress={() => update('role', 'chef')}
            >
              <Text className={form.role === 'chef' ? 'text-eplate-brown font-semibold' : 'text-eplate-midgray'}>
                Chef
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-eplate-darkgray mb-1">Password</Text>
          <TextInput
            className="border border-eplate-lightgray rounded-xl px-4 py-3 text-base bg-white"
            value={form.password}
            onChangeText={(v) => update('password', v)}
            secureTextEntry
            autoComplete="new-password"
            placeholder="Min 8 characters"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-eplate-darkgray mb-1">Confirm password</Text>
          <TextInput
            className="border border-eplate-lightgray rounded-xl px-4 py-3 text-base bg-white"
            value={form.password_confirmation}
            onChangeText={(v) => update('password_confirmation', v)}
            secureTextEntry
            autoComplete="new-password"
          />
        </View>

        <Pressable
          className={`rounded-xl py-3.5 items-center ${isLoading ? 'bg-eplate-midgray' : 'bg-eplate-charcoal'}`}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold text-base">
            {isLoading ? 'Creating account...' : 'Create account'}
          </Text>
        </Pressable>

        <View className="flex-row justify-center mt-6">
          <Text className="text-eplate-midgray">Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text className="text-eplate-gold font-semibold">Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
