<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeeklyMenuIndexResource extends JsonResource
{
    /**
     * Lightweight list payload for index.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'duration_days' => (int) $this->duration_days,
            'menu_scope' => $this->menu_scope,
            'required_meal_count' => (int) $this->required_meal_count,
            'base_price' => (string) $this->base_price,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
