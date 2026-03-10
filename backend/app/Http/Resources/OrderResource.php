<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Full order detail payload.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $chef     = $this->chef;
        $chefUser = $chef?->user;

        return [
            'id'               => $this->id,
            'status'           => $this->status,
            'subtotal'         => (string) $this->subtotal,
            'platform_fee'     => (string) $this->platform_fee,
            'tax'              => (string) $this->tax,
            'total'            => (string) $this->total,
            'currency'         => $this->currency,
            'delivery_date'    => $this->delivery_date?->format('Y-m-d'),
            'delivery_address' => $this->delivery_address,
            'notes'            => $this->notes,
            'placed_at'        => $this->placed_at?->toIso8601String(),
            'cancelled_at'     => $this->cancelled_at?->toIso8601String(),
            'created_at'       => $this->created_at?->toIso8601String(),

            'chef' => $chef ? [
                'id'         => $chef->id,
                'slug'       => $chef->slug,
                'first_name' => $chefUser?->first_name,
                'last_name'  => $chefUser?->last_name,
                'photo_url'  => $chefUser?->photo_url ?? null,
            ] : null,

            'order_menu' => $this->whenLoaded('orderMenu', function () {
                $menu = $this->orderMenu;
                return [
                    'id'               => $menu->id,
                    'weekly_menu_id'   => $menu->weekly_menu_id,
                    'menu_name'        => $menu->menu_name,
                    'menu_description' => $menu->menu_description,
                    'price'            => (string) $menu->price,
                    'items'            => $menu->orderMenuItems->map(fn ($item) => [
                        'id'               => $item->id,
                        'dish_id'          => $item->dish_id,
                        'dish_name'        => $item->dish_name,
                        'dish_description' => $item->dish_description,
                        'sort_order'       => $item->sort_order,
                    ])->values(),
                ];
            }),

            'status_history' => $this->whenLoaded('statusEvents', function () {
                return $this->statusEvents->map(fn ($event) => [
                    'id'         => $event->id,
                    'status'     => $event->status,
                    'note'       => $event->note,
                    'created_at' => $event->created_at?->toIso8601String(),
                ])->values();
            }),
        ];
    }
}
