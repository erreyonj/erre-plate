<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderSummaryResource;
use App\Models\Order;
use App\Models\OrderStatusEvent;
use App\Services\OrderCreator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function __construct(private OrderCreator $orderCreator) {}

    /**
     * List the authenticated customer's orders.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = $request->user()
            ->orders()
            ->with(['chef.user', 'orderMenu'])
            ->latest('placed_at')
            ->paginate(20);

        return OrderSummaryResource::collection($orders);
    }

    /**
     * Show a single order with full detail.
     */
    public function show(Request $request, Order $order): OrderResource
    {
        abort_if($order->user_id !== $request->user()->id, 403);

        $order->load('orderMenu.orderMenuItems', 'statusEvents', 'chef.user');

        return new OrderResource($order);
    }

    /**
     * Place a new order for a weekly menu.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'weekly_menu_id'           => 'required|integer|exists:weekly_menus,id',
            'delivery_date'            => 'nullable|date|after:today',
            'delivery_address'         => 'nullable|array',
            'delivery_address.street'  => 'nullable|string',
            'delivery_address.city'    => 'nullable|string',
            'delivery_address.state'   => 'nullable|string',
            'delivery_address.zip'     => 'nullable|string',
            'notes'                    => 'nullable|string|max:500',
        ]);

        $order = $this->orderCreator->create(
            $request->user()->id,
            $validated['weekly_menu_id'],
            [
                'delivery_date'    => $validated['delivery_date'] ?? null,
                'delivery_address' => $validated['delivery_address'] ?? null,
                'notes'            => $validated['notes'] ?? null,
            ]
        );

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Cancel an order. Only allowed when status is pending or confirmed.
     */
    public function cancel(Request $request, Order $order): OrderResource
    {
        abort_if($order->user_id !== $request->user()->id, 403);

        if (! in_array($order->status, ['pending', 'confirmed'], true)) {
            abort(422, 'Order cannot be cancelled at this stage.');
        }

        $order->update([
            'status'       => 'cancelled',
            'cancelled_at' => now(),
        ]);

        OrderStatusEvent::create([
            'order_id'   => $order->id,
            'status'     => 'cancelled',
            'note'       => $request->input('reason'),
            'created_by' => $request->user()->id,
        ]);

        $order->load('orderMenu.orderMenuItems', 'statusEvents', 'chef.user');

        return new OrderResource($order);
    }
}
