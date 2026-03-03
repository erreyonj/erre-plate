<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Neighborhood extends Model
{
    protected $table = 'neighborhoods';

    protected $fillable = [
        'name',
        'slug',
        'zip_code',
        'city',
        'state',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'neighborhood_id');
    }

    public function chefs()
    {
        return $this->hasMany(ChefProfile::class, 'neighborhood_id');
    }
}