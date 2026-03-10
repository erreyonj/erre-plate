<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderMenuItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'order_menu_id',
        'dish_id',
        'dish_name',
        'dish_description',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    public function orderMenu(): BelongsTo
    {
        return $this->belongsTo(OrderMenu::class);
    }

    public function dish(): BelongsTo
    {
        return $this->belongsTo(Dish::class);
    }
}
