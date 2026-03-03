<?php

namespace Database\Seeders;

use App\Models\Neighborhood;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NeighborhoodSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
        $neighborhoods = [
            ['name' => 'Downtown',              'zip_code' => '53703'],
            ['name' => 'North Side',            'zip_code' => '53704'],
            ['name' => 'West Side',             'zip_code' => '53705'],
            ['name' => 'UW-Madison Campus',     'zip_code' => '53706'],
            ['name' => 'Near West',             'zip_code' => '53711'],
            ['name' => 'South Madison',         'zip_code' => '53713'],
            ['name' => 'East Madison',          'zip_code' => '53714'],
            ['name' => 'Near West Madison',     'zip_code' => '53715'],
            ['name' => 'Southeast',             'zip_code' => '53716'],
            ['name' => 'Far West',              'zip_code' => '53717'],
            ['name' => 'East Madison',          'zip_code' => '53718'],
            ['name' => 'Southwest Madison',     'zip_code' => '53719'],
            ['name' => 'Shorewood Hills',       'zip_code' => '53726'],
            ['name' => 'UW Hospital',           'zip_code' => '53792'],
        ];

        foreach ($neighborhoods as $n) {
            Neighborhood::create([
                'name' => $n['name'],
                'zip_code' => $n['zip_code'],
                'city' => 'Madison',
                'state' => 'WI',
                ]);
            }
        });
    }
}