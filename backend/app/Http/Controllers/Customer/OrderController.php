<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\WeeklyMenu;
use App\Services\ChefAvailabilityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request, ChefAvailabilityService $availability)
    {
        $validated = $request->validate([
            'weekly_menu_id' => 'required|exists:weekly_menus,id',
            'delivery_address' => 'required|array',
        ]);

        $menu = WeeklyMenu::with('chefProfile')->findOrFail($validated['weekly_menu_id']);
        $chef = $menu->chefProfile;

        // 🔥 Hard availability check
        if (!$availability->isChefAvailable($chef)) {
            return response()->json([
                'message' => 'Chef is not accepting orders at this time.'
            ], 422);
        }

        $deliveryDate = $availability->getNextEligibleDeliveryDate($chef);

        return DB::transaction(function () use ($request, $chef, $menu, $validated, $deliveryDate) {

            $order = Order::create([
                'customer_id' => $request->user()->id,
                'chef_profile_id' => $chef->id,
                'weekly_menu_id' => $menu->id,
                'bundle_price' => $menu->bundle_price,
                'cash_paid' => 0,
                'delivery_address' => $validated['delivery_address'],
                'menu_snapshot' => $menu->toArray(),
                'delivery_date' => $deliveryDate,
            ]);

            return response()->json($order->fresh(), 201);
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Customer Methods
    |--------------------------------------------------------------------------
    */
    public function customerIndex(Request $request)
    {
        return $request->user()
            ->orders()
            ->latest()
            ->get();
    }

    public function customerShow(Request $request, Order $order)
    {
        if ($order->customer_id !== $request->user()->id) {
            abort(403);
        }

        return $order;
    }

    public function cancel(Request $request, Order $order)
    {
        if ($order->customer_id !== $request->user()->id) {
            abort(403);
        }

        if (!in_array($order->status, ['pending', 'accepted'])) {
            return response()->json([
                'message' => 'Order cannot be cancelled at this stage.'
            ], 422);
        }

        $order->update(['status' => 'cancelled']);

        return $order;
    }

    /*
    |--------------------------------------------------------------------------
    | Chef Methods
    |--------------------------------------------------------------------------
    */

    public function chefIndex(Request $request)
    {
        $chefProfile = $request->user()->chefProfile;

        return $chefProfile
            ->orders()
            ->latest()
            ->get();
    }

    public function chefShow(Request $request, Order $order)
    {
        $chefProfile = $request->user()->chefProfile;

        if ($order->chef_profile_id !== $chefProfile->id) {
            abort(403);
        }

        return $order;
    }

    public function updateStatus(Request $request, Order $order)
    {
        $chefProfile = $request->user()->chefProfile;

        if ($order->chef_profile_id !== $chefProfile->id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:accepted,shopping,preparing,ready,delivered,completed'
        ]);

        $order->update([
            'status' => $validated['status']
        ]);

        return $order;
    }
}