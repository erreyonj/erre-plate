<?php

namespace App\Policies;

use App\Models\Dish;
use App\Models\User;

class DishPolicy
{
    /**
     * Dish must belong to the authenticated chef.
     */
    public function view(User $user, Dish $dish): bool
    {
        return $this->ownsDish($user, $dish);
    }

    public function update(User $user, Dish $dish): bool
    {
        return $this->ownsDish($user, $dish);
    }

    private function ownsDish(User $user, Dish $dish): bool
    {
        $profile = $user->chefProfile;

        return $profile && (int) $profile->id === (int) $dish->chef_profile_id;
    }
}
