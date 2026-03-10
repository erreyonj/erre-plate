<?php

namespace App\Http\Controllers\Chef;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderSummaryResource;
use App\Models\Order;
use App\Models\OrderStatusEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class ChefOrderController extends Controller
{
    /**
     * Valid status transitions a chef may make.
     * Keys = current status, values = allowed next statuses.
     */
    private const ALLOWED_TRANSITIONS = [
        'pending'   => ['confirmed', 'cancelled'],
        'confirmed' => ['preparing', 'cancelled'],
        'preparing' => ['ready'],
        'ready'     => ['completed'],
    ];

    /**
     * List all orders for the authenticated chef.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $chefProfile = $request->user()->chefProfile;

        abort_if(! $chefProfile, 403);

        $orders = $chefProfile->orders()
            ->with(['orderMenu', 'chef.user'])
            ->latest('placed_at')
            ->paginate(20);

        return OrderSummaryResource::collection($orders);
    }

    /**
     * Update an order's status (chef side).
     */
    public function updateStatus(Request $request, Order $order): OrderResource
    {
        $chefProfile = $request->user()->chefProfile;

        abort_if(! $chefProfile || $order->chef_profile_id !== $chefProfile->id, 403);

        $allowedNext = self::ALLOWED_TRANSITIONS[$order->status] ?? [];

        $validated = $request->validate([
            'status' => ['required', Rule::in($allowedNext)],
            'note'   => 'nullable|string|max:500',
        ]);

        $order->update(['status' => $validated['status']]);

        OrderStatusEvent::create([
            'order_id'   => $order->id,
            'status'     => $validated['status'],
            'note'       => $validated['note'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        $order->load('orderMenu.orderMenuItems', 'statusEvents', 'chef.user');

        return new OrderResource($order);
    }
}
