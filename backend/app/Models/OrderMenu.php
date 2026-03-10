<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OrderMenuItem;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderMenu extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'weekly_menu_id',
        'menu_name',
        'menu_description',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'price'      => 'decimal:2',
            'created_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function orderMenuItems(): HasMany
    {
        return $this->hasMany(OrderMenuItem::class)->orderBy('sort_order');
    }

    public function weeklyMenu(): BelongsTo
    {
        return $this->belongsTo(WeeklyMenu::class);
    }
}
