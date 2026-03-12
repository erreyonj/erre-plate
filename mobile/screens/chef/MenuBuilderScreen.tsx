import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useMenuBuilder } from '../../hooks/useMenuBuilder';
import { calculateRequiredMealCount } from '../../types/menu';
import type { ChefScreenProps } from '../../navigation/types';
import type { MenuScope } from '../../types/menu';

const SCOPE_OPTIONS: { label: string; value: MenuScope }[] = [
  { label: 'Full (B+L+D)', value: 'full' },
  { label: 'Breakfast', value: 'breakfast_only' },
  { label: 'Lunch', value: 'lunch_only' },
  { label: 'Dinner', value: 'dinner_only' },
];

export default function MenuBuilderScreen({
  route,
  navigation,
}: ChefScreenProps<'MenuBuilder'>) {
  const { menuId } = route.params;
  const {
    menu,
    draft,
    isLoading,
    isError,
    isSaving,
    isPublishing,
    assignedForUi,
    counts,
    publishErrors,
    canPublish,
    dirty,
    handleBackToOverview,
    handleTitleChange,
    handleBasePriceChange,
    handleDurationChange,
    handleScopeChange,
    handleChangeMealsCovered,
    handleRemoveAssignedDish,
    handleSave,
    handlePublish,
  } = useMenuBuilder(menuId, () => navigation.goBack());

  if (isLoading || !draft) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !menu) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-red-500 text-center">Could not load this menu.</Text>
        <Pressable className="mt-4" onPress={() => navigation.goBack()}>
          <Text className="text-amber-600 font-semibold">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const requiredTotal = calculateRequiredMealCount(draft.duration_days, draft.menu_scope);

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="px-4 py-4 pb-32">
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Menu Title</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
          value={draft.title}
          onChangeText={handleTitleChange}
          placeholder="e.g. Summer Wellness Pack"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Base Price ($)</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
          value={String(draft.base_price)}
          onChangeText={(v) => handleBasePriceChange(Number(v) || 0)}
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Duration</Text>
        <View className="flex-row gap-3">
          {([5, 7] as const).map((d) => (
            <Pressable
              key={d}
              className={`flex-1 rounded-xl py-3 items-center border ${
                draft.duration_days === d ? 'border-amber-500 bg-amber-50' : 'border-gray-300'
              }`}
              onPress={() => handleDurationChange(d)}
            >
              <Text
                className={
                  draft.duration_days === d
                    ? 'text-amber-700 font-semibold'
                    : 'text-gray-600'
                }
              >
                {d} days
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Scope</Text>
        <View className="flex-row flex-wrap gap-2">
          {SCOPE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              className={`px-4 py-2 rounded-xl border ${
                draft.menu_scope === opt.value
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-300'
              }`}
              onPress={() => handleScopeChange(opt.value)}
            >
              <Text
                className={
                  draft.menu_scope === opt.value
                    ? 'text-amber-700 font-semibold text-sm'
                    : 'text-gray-600 text-sm'
                }
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="border border-gray-100 rounded-2xl p-4 mb-4">
        <Text className="text-sm font-bold text-gray-800 mb-2">Meal Progress</Text>
        <Text className="text-sm text-gray-600">
          {counts.total} / {requiredTotal} meals assigned
        </Text>
        <View className="flex-row gap-4 mt-2">
          <Text className="text-xs text-gray-500">B: {counts.breakfast}</Text>
          <Text className="text-xs text-gray-500">L: {counts.lunch}</Text>
          <Text className="text-xs text-gray-500">D: {counts.dinner}</Text>
        </View>
      </View>

      {publishErrors.length > 0 && (
        <View className="bg-red-50 rounded-xl p-3 mb-4">
          {publishErrors.map((err, i) => (
            <Text key={i} className="text-sm text-red-600 mb-0.5">
              {err}
            </Text>
          ))}
        </View>
      )}

      <Text className="text-base font-bold text-gray-900 mb-3">Assigned Dishes</Text>
      {assignedForUi.length === 0 ? (
        <Text className="text-sm text-gray-500 mb-4">No dishes assigned yet.</Text>
      ) : (
        assignedForUi.map((assigned) => (
          <View
            key={assigned.id}
            className="border border-gray-100 rounded-xl p-3 mb-2 flex-row justify-between items-center"
          >
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900">{assigned.dish.name}</Text>
              <Text className="text-xs text-gray-500 capitalize">{assigned.meal_type}</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <TextInput
                className="border border-gray-300 rounded-lg px-2 py-1 w-12 text-center text-sm"
                value={String(assigned.meals_covered)}
                onChangeText={(v) =>
                  handleChangeMealsCovered(assigned.id, Number(v) || 1)
                }
                keyboardType="numeric"
              />
              <Pressable onPress={() => handleRemoveAssignedDish(assigned.id)}>
                <Text className="text-red-500 text-sm font-semibold">Remove</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      <View className="mt-6 gap-3">
        <Pressable
          className={`rounded-xl py-3.5 items-center ${
            !dirty || isSaving ? 'bg-gray-300' : 'bg-amber-600'
          }`}
          onPress={handleSave}
          disabled={!dirty || isSaving}
        >
          <Text className="text-white font-semibold">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Text>
        </Pressable>

        <Pressable
          className={`rounded-xl py-3.5 items-center ${
            !canPublish || isPublishing ? 'bg-gray-300' : 'bg-gray-900'
          }`}
          onPress={handlePublish}
          disabled={!canPublish || isPublishing}
        >
          <Text className="text-white font-semibold">
            {isPublishing ? 'Publishing...' : 'Publish Menu'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
