<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WeeklyMenu;

class WeeklyMenuPolicy
{
    /**
     * Menu must belong to the authenticated chef.
     */
    public function view(User $user, WeeklyMenu $menu): bool
    {
        return $this->ownsMenu($user, $menu);
    }

    /**
     * Menu must belong to chef and be draft to edit.
     */
    public function update(User $user, WeeklyMenu $menu): bool
    {
        return $this->ownsMenu($user, $menu) && $menu->status === 'draft';
    }

    public function delete(User $user, WeeklyMenu $menu): bool
    {
        return $this->ownsMenu($user, $menu);
    }

    /**
     * Only draft menus can be published; must belong to chef.
     */
    public function publish(User $user, WeeklyMenu $menu): bool
    {
        return $this->ownsMenu($user, $menu) && $menu->status === 'draft';
    }

    /**
     * Only published menus can be archived; must belong to chef.
     */
    public function archive(User $user, WeeklyMenu $menu): bool
    {
        return $this->ownsMenu($user, $menu) && $menu->status === 'published';
    }

    private function ownsMenu(User $user, WeeklyMenu $menu): bool
    {
        $profile = $user->chefProfile;

        return $profile && (int) $profile->id === (int) $menu->chef_profile_id;
    }
}
