<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Neighborhood;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {

            $faker = Faker::create();

            $names = [
                ['Maseru', 'Kuramoto'],
                ['Rigo', 'Sotokawa'],
                ['Makoto', 'Shimoura'],
                ['Ryo', 'Torishima'],
                ['Asher', 'Watanabe'],
                ['Rein', 'Kestrelle'],
                ['Aldrin', 'Kestrelle'],
                ['Belrusé', 'Valmere'],
                ['Nidonna', 'Valmere'],
                ['Kuri', 'Tanaka'],
                ['Yenna', 'Mikado'],
                ['Zan', 'Arashi'],
            ];

            $neighborhoods = Neighborhood::all();

            foreach ($names as $index => $name) {

                $neighborhood = $neighborhoods->random();

                $creditBalance = rand(0, 150);

                // Give first 3 users high credit balances (for testing)
                if ($index < 3) {
                    $creditBalance = rand(200, 350);
                }

                User::create([
                    'first_name' => $name[0],
                    'last_name' => $name[1],
                    'email' => strtolower($name[0] . '.' . $name[1] . '@erreplate.test'),
                    'password' => Hash::make('password'),
                    'role' => 'customer',
                    'phone' => $faker->phoneNumber,
                    'credit_balance' => $creditBalance,
                    'neighborhood_id' => $neighborhood->id,
                    'address' => [
                        'street' => $faker->streetAddress,
                        'city' => 'Madison',
                        'state' => 'WI',
                        'zip' => $neighborhood->zip_code,
                    ],
                ]);
            }
        });
    }
}