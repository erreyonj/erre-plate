<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderMenu;
use App\Models\OrderMenuItem;
use App\Models\OrderStatusEvent;
use App\Models\WeeklyMenu;
use Illuminate\Support\Facades\DB;

class OrderCreator
{
    /**
     * Platform fee as a decimal fraction (5 %).
     * Move to config/orders.php when formalizing pricing.
     */
    private const PLATFORM_FEE_RATE = 0.05;

    /**
     * Create a full order from a weekly menu, snapshotting all menu + dish data.
     *
     * @param  int        $userId        The customer placing the order.
     * @param  int        $weeklyMenuId  The menu being ordered.
     * @param  array      $options       Optional overrides (delivery_date, delivery_address, notes).
     * @return Order
     */
    public function create(int $userId, int $weeklyMenuId, array $options = []): Order
    {
        return DB::transaction(function () use ($userId, $weeklyMenuId, $options) {
            // 1. Load menu with all assigned dishes (nested dish model)
            $menu = WeeklyMenu::with('weeklyMenuDishes.dish')
                ->findOrFail($weeklyMenuId);

            // 2. Compute pricing
            $subtotal    = (float) $menu->base_price;
            $platformFee = round($subtotal * self::PLATFORM_FEE_RATE, 2);
            $tax         = 0.00; // Phase 2: calculate from delivery jurisdiction
            $total       = round($subtotal + $platformFee + $tax, 2);

            // 3. Create the Order record
            $order = Order::create([
                'user_id'          => $userId,
                'chef_profile_id'  => $menu->chef_profile_id,
                'status'           => 'pending',
                'subtotal'         => $subtotal,
                'platform_fee'     => $platformFee,
                'tax'              => $tax,
                'total'            => $total,
                'currency'         => 'USD',
                'delivery_date'    => $options['delivery_date'] ?? null,
                'delivery_address' => $options['delivery_address'] ?? null,
                'notes'            => $options['notes'] ?? null,
                'placed_at'        => now(),
            ]);

            // 4. Snapshot the WeeklyMenu
            $orderMenu = OrderMenu::create([
                'order_id'         => $order->id,
                'weekly_menu_id'   => $menu->id,
                'menu_name'        => $menu->title,
                'menu_description' => $menu->description,
                'price'            => $subtotal,
            ]);

            // 5. Snapshot each assigned dish
            foreach ($menu->weeklyMenuDishes as $index => $assigned) {
                $dish = $assigned->dish;

                OrderMenuItem::create([
                    'order_menu_id'    => $orderMenu->id,
                    'dish_id'          => $dish?->id,
                    'dish_name'        => $dish?->name ?? 'Unnamed dish',
                    'dish_description' => $dish?->description,
                    'sort_order'       => $index,
                ]);
            }

            // 6. Record the initial status event
            OrderStatusEvent::create([
                'order_id'   => $order->id,
                'status'     => 'pending',
                'note'       => 'Order placed',
                'created_by' => $userId,
            ]);

            return $order->load(
                'orderMenu.orderMenuItems',
                'statusEvents',
                'chef.user'
            );
        });
    }
}
