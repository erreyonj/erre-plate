<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderSummaryResource extends JsonResource
{
    /**
     * Lightweight order listing payload.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $chef     = $this->chef;
        $chefUser = $chef?->user;

        return [
            'id'        => $this->id,
            'status'    => $this->status,
            'total'     => (string) $this->total,
            'currency'  => $this->currency,
            'placed_at' => $this->placed_at?->toIso8601String(),

            'chef_name' => $chefUser
                ? trim("{$chefUser->first_name} {$chefUser->last_name}")
                : null,

            'chef_slug' => $chef?->slug,

            'menu_name' => $this->whenLoaded('orderMenu', function () {
                return $this->orderMenu?->menu_name;
            }),
        ];
    }
}
