<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DishResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'meal_type' => $this->meal_type,
            'prep_time_minutes' => $this->prep_time_minutes,
            'ingredients' => $this->ingredients,
            'dietary_tags' => $this->dietary_tags,

            'photos' => DishPhotoResource::collection(
                $this->whenLoaded('photos')
            ),
        ];
    }
}
