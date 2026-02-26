<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeeklyMenuResource extends JsonResource
{
    /**
     * Full builder payload: menu + assigned dishes with nested dish.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'duration_days' => (int) $this->duration_days,
            'menu_scope' => $this->menu_scope,
            'required_meal_count' => (int) $this->required_meal_count,
            'base_price' => (string) $this->base_price,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'assigned_dishes' => $this->whenLoaded('assignedDishes', function () {
                return $this->assignedDishes->map(fn ($entry) => [
                    'id' => $entry->id,
                    'dish_id' => $entry->dish_id,
                    'meals_covered' => (int) $entry->meals_covered,
                    'meal_type' => $entry->meal_type,
                    'dish' => $entry->dish ? [
                        'id' => $entry->dish->id,
                        'name' => $entry->dish->name,
                        'description' => $entry->dish->description,
                        'meal_type' => $entry->dish->meal_type,
                        'ingredients' => $entry->dish->ingredients,
                        'dietary_tags' => $entry->dish->dietary_tags,
                    ] : null,
                ]);
            }, []),
        ];
    }
}
