<?php

namespace App\Services;

use App\Models\ChefProfile;
use Carbon\Carbon;

class ChefAvailabilityService
{
    public function isChefAvailable(ChefProfile $chef): bool
    {
        if ($chef->status !== 'approved') {
            return false;
        }

        if ($chef->is_paused) {
            return false;
        }

        if (!$this->isBeforeCutoff($chef)) {
            return false;
        }

        if ($this->hasReachedOrderLimit($chef)) {
            return false;
        }

        return true;
    }

    public function getNextEligibleDeliveryDate(ChefProfile $chef): Carbon
    {
        $now = Carbon::now();

        $delivery = $this->nextWeekday($chef->delivery_day);

        // If we're past cutoff, move delivery to next cycle
        if (!$this->isBeforeCutoff($chef)) {
            $delivery->addWeek();
        }

        return $delivery;
    }

    protected function isBeforeCutoff(ChefProfile $chef): bool
    {
        $now = Carbon::now();
        $cutoff = $this->nextWeekday($chef->cutoff_day)
            ->setTimeFromTimeString($chef->cutoff_time);

        return $now->lessThan($cutoff);
    }

    protected function hasReachedOrderLimit(ChefProfile $chef): bool
    {
        $deliveryDate = $this->getNextEligibleDeliveryDate($chef);

        $activeStatuses = [
            'pending',
            'accepted',
            'shopping',
            'preparing',
            'ready'
        ];

        $count = $chef->orders()
            ->whereIn('status', $activeStatuses)
            ->whereDate('delivery_date', $deliveryDate)
            ->count();

        return $count >= $chef->max_orders_per_cycle;
    }

    protected function nextWeekday(string $weekday): Carbon
    {
        $date = Carbon::now()->next($weekday);

        // If today is that weekday, we want today — not next week
        if (Carbon::now()->isSameDay($date)) {
            return Carbon::now();
        }

        return $date->startOfDay();
    }
}