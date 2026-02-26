<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WeeklyMenuDish;

class WeeklyMenuDishPolicy
{
    /**
     * The assigned dish's menu must belong to the chef and be draft.
     */
    public function update(User $user, WeeklyMenuDish $weeklyMenuDish): bool
    {
        $menu = $weeklyMenuDish->weeklyMenu;

        return $menu
            && $menu->status === 'draft'
            && $this->ownsMenu($user, $menu);
    }

    public function delete(User $user, WeeklyMenuDish $weeklyMenuDish): bool
    {
        $menu = $weeklyMenuDish->weeklyMenu;

        return $menu
            && $menu->status === 'draft'
            && $this->ownsMenu($user, $menu);
    }

    private function ownsMenu(User $user, $menu): bool
    {
        $profile = $user->chefProfile;

        return $profile && (int) $profile->id === (int) $menu->chef_profile_id;
    }
}
