<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\DishPhotoResource;

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
            'assigned_dishes' => $this->assignedDishes->map(function ($assigned) {
                return [
                    'id' => $assigned->id,
                    'dish_id' => $assigned->dish_id,
                    'meals_covered' => $assigned->meals_covered,
                    'meal_type' => $assigned->meal_type,

                    'dish' => new DishResource($assigned->dish),
                ];
            }),
        ];
    }
}
