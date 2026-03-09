<?php
// app/Http/Resources/PublicChefProfileResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicChefProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'slug'           => $this->slug,
            'tagline'        => $this->tagline,
            'bio'            => $this->bio,
            'specialties'    => $this->specialties,
            'hourly_rate'    => $this->hourly_rate,
            'delivery_day'   => $this->delivery_day,
            'cutoff_day'     => $this->cutoff_day,
            'cutoff_time'    => $this->cutoff_time,
            'status'         => $this->status,
            'is_available'   => $this->is_available,
            'rating_average' => $this->rating_average,
            'rating_count'   => $this->rating_count ?? 0,

            // From associated User
            'photo_url'      => $this->user->photo_url,
            'first_name'     => $this->user->first_name,
            'last_name'      => $this->user->last_name,
        ];
    }
}