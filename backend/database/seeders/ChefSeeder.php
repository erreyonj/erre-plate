<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ChefProfile;
use App\Models\Neighborhood;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class ChefSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {

            $faker = Faker::create();

            $names = [
                ['Moro', 'Takayama'],
                ['Tekimoro', 'Hayashi'],
                ['Blanc', 'Vide'],
                ['Auguste', 'Vide'],
                ['Nivera', 'Kuramoto'],
            ];

            $specialtyPool = [
                'Japanese',
                'BBQ',
                'Vegan',
                'Italian',
                'French',
                'Mediterranean',
                'Thai',
                'Korean',
                'Farm-to-Table',
                'American',
                'Southern',
                'Soul Food',
                'Creole',
                'Cajun',
                'Tex-Mex',
                'Southwestern',
                'Mexican',
                'Spanish',
                'Indian',
                'Chinese',
                'Vietnamese',
            ];

            $neighborhoods = Neighborhood::all();

            foreach ($names as $index => $name) {

                $neighborhood = $neighborhoods->random();

                $user = User::create([
                    'first_name' => $name[0],
                    'last_name' => $name[1],
                    'email' => strtolower($name[0] . '.' . $name[1] . '@erreplate.test'),
                    'password' => Hash::make('password'),
                    'role' => 'chef',
                    'phone' => $faker->phoneNumber,
                    'credit_balance' => rand(50, 300),
                    'neighborhood_id' => $neighborhood->id,
                    'address' => [
                        'street' => $faker->streetAddress,
                        'city' => 'Madison',
                        'state' => 'WI',
                        'zip' => $neighborhood->zip_code,
                    ],
                ]);

                $maxOrders = rand(5, 20);

                $currentOrders = rand(0, 3);

                // Edge case: one chef unavailable
                $isAvailable = $index !== 1;

                // Edge case: one chef near max capacity
                if ($index === 2) {
                    $currentOrders = $maxOrders - 1;
                }

                ChefProfile::create([
                    'user_id' => $user->id,
                    'bio' => $faker->paragraph(2),
                    'specialties' => collect($specialtyPool)
                        ->random(rand(2, 4))
                        ->values()
                        ->toArray(),
                    'hourly_rate' => rand(25, 75),
                    'max_orders_per_week' => $maxOrders,
                    'rating_avg' => rand(42, 50) / 10, // 4.2 – 5.0
                    'rating_count' => rand(5, 100),
                    'status' => 'approved',
                    'is_available' => $isAvailable,
                    'current_orders' => $currentOrders,
                ]);
            }
        });
    }
}