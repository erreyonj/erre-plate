<?php

namespace Database\Seeders;

use App\Models\ChefProfile;
use App\Models\Dish;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DishSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $chefs = ChefProfile::all();

            foreach ($chefs as $chef) {
                $subset = collect(self::$templates)
                    ->shuffle()
                    ->take(rand(8, 15));

                foreach ($subset as $template) {
                    Dish::create([
                        'chef_profile_id' => $chef->id,
                        'name'            => $template['name'],
                        'description'     => $template['description'],
                        'meal_type'       => $template['meal_type'],
                        'ingredients'     => $template['ingredients'],
                        'dietary_tags'    => [],
                        'is_active'       => true,
                    ]);
                }
            }
        });
    }

    private static array $templates = [
        // ── Breakfast ────────────────────────────────────────────
        [
            'name'        => 'Spinach Egg Scramble',
            'description' => 'Fluffy scrambled eggs folded with fresh spinach and feta.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'eggs', 'unit' => 'dz', 'quantity' => '1'],
                ['name' => 'spinach', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'feta cheese', 'unit' => 'oz', 'quantity' => '2'],
                ['name' => 'butter', 'unit' => 'tbsp', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Honey Yogurt Parfait',
            'description' => 'Layered Greek yogurt with granola, berries, and a drizzle of honey.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'Greek yogurt', 'unit' => 'oz', 'quantity' => '8'],
                ['name' => 'granola', 'unit' => 'cup', 'quantity' => '1'],
                ['name' => 'mixed berries', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'honey', 'unit' => 'tbsp', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Breakfast Tacos',
            'description' => 'Warm tortillas stuffed with scrambled eggs, cheese, and salsa.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'tortillas', 'unit' => 'pk', 'quantity' => '1'],
                ['name' => 'eggs', 'unit' => 'dz', 'quantity' => '1'],
                ['name' => 'cheddar cheese', 'unit' => 'oz', 'quantity' => '3'],
                ['name' => 'salsa', 'unit' => 'oz', 'quantity' => '4'],
            ],
        ],
        [
            'name'        => 'Cinnamon Oat Bowl',
            'description' => 'Creamy steel-cut oats with cinnamon, walnuts, and maple syrup.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'steel-cut oats', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'cinnamon', 'unit' => 'tsp', 'quantity' => '1'],
                ['name' => 'walnuts', 'unit' => 'oz', 'quantity' => '2'],
                ['name' => 'maple syrup', 'unit' => 'tbsp', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Avocado Toast Stack',
            'description' => 'Sourdough topped with smashed avocado, cherry tomatoes, and everything seasoning.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'sourdough bread', 'unit' => 'slices', 'quantity' => '4'],
                ['name' => 'avocado', 'unit' => 'whole', 'quantity' => '2'],
                ['name' => 'cherry tomatoes', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'everything seasoning', 'unit' => 'tsp', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Blueberry Pancake Plate',
            'description' => 'Buttermilk pancakes studded with blueberries, served with butter and syrup.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'pancake mix', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'blueberries', 'unit' => 'oz', 'quantity' => '6'],
                ['name' => 'butter', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'maple syrup', 'unit' => 'tbsp', 'quantity' => '3'],
            ],
        ],
        [
            'name'        => 'Veggie Frittata Slice',
            'description' => 'Oven-baked egg frittata loaded with bell peppers, onions, and herbs.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'eggs', 'unit' => 'dz', 'quantity' => '1'],
                ['name' => 'bell peppers', 'unit' => 'whole', 'quantity' => '2'],
                ['name' => 'onion', 'unit' => 'whole', 'quantity' => '1'],
                ['name' => 'fresh herbs', 'unit' => 'tbsp', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Banana Walnut Muffins',
            'description' => 'Moist banana muffins with crunchy walnut pieces.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'bananas', 'unit' => 'whole', 'quantity' => '3'],
                ['name' => 'flour', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'walnuts', 'unit' => 'oz', 'quantity' => '3'],
                ['name' => 'sugar', 'unit' => 'cup', 'quantity' => '0.5'],
            ],
        ],
        [
            'name'        => 'Smoked Salmon Bagel',
            'description' => 'Toasted bagel with cream cheese, smoked salmon, capers, and red onion.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'bagels', 'unit' => 'whole', 'quantity' => '4'],
                ['name' => 'smoked salmon', 'unit' => 'oz', 'quantity' => '6'],
                ['name' => 'cream cheese', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'capers', 'unit' => 'tbsp', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Chorizo Breakfast Bowl',
            'description' => 'Spiced chorizo with roasted potatoes, eggs, and pickled jalapeños.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'chorizo', 'unit' => 'oz', 'quantity' => '8'],
                ['name' => 'potatoes', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'eggs', 'unit' => 'whole', 'quantity' => '4'],
                ['name' => 'pickled jalapeños', 'unit' => 'oz', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'French Toast Casserole',
            'description' => 'Baked French toast with custard, vanilla, and powdered sugar.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'brioche bread', 'unit' => 'slices', 'quantity' => '8'],
                ['name' => 'eggs', 'unit' => 'whole', 'quantity' => '6'],
                ['name' => 'milk', 'unit' => 'cup', 'quantity' => '1'],
                ['name' => 'vanilla extract', 'unit' => 'tsp', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Shakshuka',
            'description' => 'Poached eggs in a spiced tomato and pepper stew.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'eggs', 'unit' => 'whole', 'quantity' => '4'],
                ['name' => 'crushed tomatoes', 'unit' => 'oz', 'quantity' => '14'],
                ['name' => 'bell peppers', 'unit' => 'whole', 'quantity' => '2'],
                ['name' => 'cumin', 'unit' => 'tsp', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Peanut Butter Overnight Oats',
            'description' => 'Chilled oats soaked in almond milk with peanut butter and chia seeds.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'rolled oats', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'almond milk', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'peanut butter', 'unit' => 'tbsp', 'quantity' => '3'],
                ['name' => 'chia seeds', 'unit' => 'tbsp', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Ham & Swiss Croissant',
            'description' => 'Buttery croissant filled with sliced ham, Swiss cheese, and Dijon.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'croissants', 'unit' => 'whole', 'quantity' => '4'],
                ['name' => 'ham slices', 'unit' => 'oz', 'quantity' => '6'],
                ['name' => 'Swiss cheese', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'Dijon mustard', 'unit' => 'tbsp', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Berry Smoothie Bowl',
            'description' => 'Thick blended berry smoothie topped with coconut flakes and seeds.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'mixed berries', 'unit' => 'oz', 'quantity' => '8'],
                ['name' => 'banana', 'unit' => 'whole', 'quantity' => '1'],
                ['name' => 'coconut flakes', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'almond milk', 'unit' => 'cup', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Mushroom & Gruyère Omelette',
            'description' => 'Classic folded omelette with sautéed mushrooms and melted Gruyère.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'eggs', 'unit' => 'whole', 'quantity' => '6'],
                ['name' => 'mushrooms', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'Gruyère cheese', 'unit' => 'oz', 'quantity' => '3'],
                ['name' => 'butter', 'unit' => 'tbsp', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Maple Sausage Patties',
            'description' => 'Homemade pork sausage patties with a touch of maple and sage.',
            'meal_type'   => 'breakfast',
            'ingredients' => [
                ['name' => 'ground pork', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'maple syrup', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'sage', 'unit' => 'tsp', 'quantity' => '1'],
                ['name' => 'salt', 'unit' => 'tsp', 'quantity' => '0.5'],
            ],
        ],

        // ── Lunch ────────────────────────────────────────────────
        [
            'name'        => 'Lemon Chicken Wrap',
            'description' => 'Grilled lemon-herb chicken wrapped in a flour tortilla with greens.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'chicken breast', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'flour tortillas', 'unit' => 'pk', 'quantity' => '1'],
                ['name' => 'lemon', 'unit' => 'whole', 'quantity' => '1'],
                ['name' => 'mixed greens', 'unit' => 'oz', 'quantity' => '4'],
            ],
        ],
        [
            'name'        => 'Roasted Veggie Grain Bowl',
            'description' => 'Farro topped with roasted seasonal vegetables and tahini dressing.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'farro', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'zucchini', 'unit' => 'whole', 'quantity' => '2'],
                ['name' => 'sweet potato', 'unit' => 'whole', 'quantity' => '1'],
                ['name' => 'tahini', 'unit' => 'tbsp', 'quantity' => '3'],
            ],
        ],
        [
            'name'        => 'Turkey Pesto Sandwich',
            'description' => 'Sliced turkey on ciabatta with basil pesto, tomato, and mozzarella.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'turkey slices', 'unit' => 'oz', 'quantity' => '6'],
                ['name' => 'ciabatta rolls', 'unit' => 'whole', 'quantity' => '4'],
                ['name' => 'basil pesto', 'unit' => 'oz', 'quantity' => '3'],
                ['name' => 'mozzarella', 'unit' => 'oz', 'quantity' => '4'],
            ],
        ],
        [
            'name'        => 'Asian Sesame Salad',
            'description' => 'Crunchy napa cabbage salad with edamame, carrots, and sesame dressing.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'napa cabbage', 'unit' => 'head', 'quantity' => '1'],
                ['name' => 'edamame', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'carrots', 'unit' => 'whole', 'quantity' => '2'],
                ['name' => 'sesame dressing', 'unit' => 'oz', 'quantity' => '4'],
            ],
        ],
        [
            'name'        => 'Black Bean Quesadilla',
            'description' => 'Crispy tortilla filled with seasoned black beans, corn, and pepper jack.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'flour tortillas', 'unit' => 'pk', 'quantity' => '1'],
                ['name' => 'black beans', 'unit' => 'can', 'quantity' => '1'],
                ['name' => 'corn kernels', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'pepper jack cheese', 'unit' => 'oz', 'quantity' => '4'],
            ],
        ],
        [
            'name'        => 'Mediterranean Falafel Plate',
            'description' => 'Crispy falafel with hummus, cucumber salad, and warm pita.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'chickpeas', 'unit' => 'can', 'quantity' => '2'],
                ['name' => 'pita bread', 'unit' => 'pk', 'quantity' => '1'],
                ['name' => 'cucumber', 'unit' => 'whole', 'quantity' => '1'],
                ['name' => 'hummus', 'unit' => 'oz', 'quantity' => '6'],
            ],
        ],
        [
            'name'        => 'Caprese Panini',
            'description' => 'Pressed panini with fresh mozzarella, tomato, and basil on focaccia.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'focaccia bread', 'unit' => 'loaf', 'quantity' => '1'],
                ['name' => 'fresh mozzarella', 'unit' => 'oz', 'quantity' => '8'],
                ['name' => 'tomatoes', 'unit' => 'whole', 'quantity' => '2'],
                ['name' => 'fresh basil', 'unit' => 'bunch', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Thai Peanut Noodle Bowl',
            'description' => 'Rice noodles tossed in spicy peanut sauce with veggies and cilantro.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'rice noodles', 'unit' => 'oz', 'quantity' => '8'],
                ['name' => 'peanut butter', 'unit' => 'tbsp', 'quantity' => '3'],
                ['name' => 'soy sauce', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'cilantro', 'unit' => 'bunch', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Grilled Shrimp Caesar',
            'description' => 'Romaine hearts with grilled shrimp, parmesan, croutons, and Caesar dressing.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'shrimp', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'romaine hearts', 'unit' => 'whole', 'quantity' => '2'],
                ['name' => 'parmesan', 'unit' => 'oz', 'quantity' => '2'],
                ['name' => 'Caesar dressing', 'unit' => 'oz', 'quantity' => '4'],
            ],
        ],
        [
            'name'        => 'Chicken Tikka Rice Box',
            'description' => 'Tandoori-spiced chicken thighs over basmati rice with raita.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'chicken thighs', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'basmati rice', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'yogurt', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'tikka spice blend', 'unit' => 'tbsp', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Harvest Kale Salad',
            'description' => 'Massaged kale with roasted squash, dried cranberries, and pepitas.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'kale', 'unit' => 'bunch', 'quantity' => '1'],
                ['name' => 'butternut squash', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'dried cranberries', 'unit' => 'oz', 'quantity' => '3'],
                ['name' => 'pepitas', 'unit' => 'oz', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'BBQ Pulled Pork Slider',
            'description' => 'Slow-cooked pulled pork on slider buns with tangy coleslaw.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'pork shoulder', 'unit' => 'lb', 'quantity' => '2'],
                ['name' => 'slider buns', 'unit' => 'pk', 'quantity' => '1'],
                ['name' => 'BBQ sauce', 'unit' => 'oz', 'quantity' => '6'],
                ['name' => 'coleslaw mix', 'unit' => 'oz', 'quantity' => '8'],
            ],
        ],
        [
            'name'        => 'Tuna Nicoise Bowl',
            'description' => 'Seared ahi tuna with green beans, olives, potatoes, and Dijon vinaigrette.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'ahi tuna', 'unit' => 'oz', 'quantity' => '8'],
                ['name' => 'green beans', 'unit' => 'oz', 'quantity' => '6'],
                ['name' => 'Kalamata olives', 'unit' => 'oz', 'quantity' => '3'],
                ['name' => 'baby potatoes', 'unit' => 'lb', 'quantity' => '0.5'],
            ],
        ],
        [
            'name'        => 'Southwest Chicken Burrito Bowl',
            'description' => 'Seasoned chicken with cilantro-lime rice, beans, and avocado crema.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'chicken breast', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'white rice', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'black beans', 'unit' => 'can', 'quantity' => '1'],
                ['name' => 'avocado', 'unit' => 'whole', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Italian Sub Roll-Up',
            'description' => 'Salami, capicola, and provolone rolled in a large flour tortilla with peppers.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'salami', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'capicola', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'provolone', 'unit' => 'oz', 'quantity' => '3'],
                ['name' => 'roasted peppers', 'unit' => 'oz', 'quantity' => '4'],
            ],
        ],
        [
            'name'        => 'Miso Glazed Tofu Bowl',
            'description' => 'Crispy tofu in white miso glaze over sushi rice with pickled radish.',
            'meal_type'   => 'lunch',
            'ingredients' => [
                ['name' => 'firm tofu', 'unit' => 'oz', 'quantity' => '14'],
                ['name' => 'white miso paste', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'sushi rice', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'pickled radish', 'unit' => 'oz', 'quantity' => '2'],
            ],
        ],

        // ── Dinner ───────────────────────────────────────────────
        [
            'name'        => 'Garlic Butter Salmon',
            'description' => 'Pan-seared salmon fillets basted in garlic herb butter.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'salmon fillets', 'unit' => 'lb', 'quantity' => '1.5'],
                ['name' => 'butter', 'unit' => 'tbsp', 'quantity' => '3'],
                ['name' => 'garlic', 'unit' => 'cloves', 'quantity' => '4'],
                ['name' => 'fresh dill', 'unit' => 'tbsp', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Braised Beef Rice Bowl',
            'description' => 'Slow-braised beef over steamed rice with pickled vegetables.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'beef chuck', 'unit' => 'lb', 'quantity' => '2'],
                ['name' => 'jasmine rice', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'soy sauce', 'unit' => 'tbsp', 'quantity' => '3'],
                ['name' => 'ginger', 'unit' => 'oz', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Herb Roasted Chicken',
            'description' => 'Whole roasted chicken with rosemary, thyme, and roasted root vegetables.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'whole chicken', 'unit' => 'lb', 'quantity' => '4'],
                ['name' => 'rosemary', 'unit' => 'sprigs', 'quantity' => '4'],
                ['name' => 'thyme', 'unit' => 'sprigs', 'quantity' => '6'],
                ['name' => 'root vegetables', 'unit' => 'lb', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Shrimp Scampi Linguine',
            'description' => 'Linguine tossed with shrimp in white wine, garlic, and lemon butter.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'linguine', 'unit' => 'oz', 'quantity' => '12'],
                ['name' => 'shrimp', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'white wine', 'unit' => 'cup', 'quantity' => '0.5'],
                ['name' => 'garlic', 'unit' => 'cloves', 'quantity' => '5'],
            ],
        ],
        [
            'name'        => 'Stuffed Bell Peppers',
            'description' => 'Bell peppers filled with ground turkey, rice, and marinara, baked until tender.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'bell peppers', 'unit' => 'whole', 'quantity' => '6'],
                ['name' => 'ground turkey', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'white rice', 'unit' => 'cup', 'quantity' => '1'],
                ['name' => 'marinara sauce', 'unit' => 'oz', 'quantity' => '12'],
            ],
        ],
        [
            'name'        => 'Lamb Kofta Plate',
            'description' => 'Spiced lamb kofta skewers with tzatziki, warm pita, and cucumber salad.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'ground lamb', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'pita bread', 'unit' => 'pk', 'quantity' => '1'],
                ['name' => 'yogurt', 'unit' => 'oz', 'quantity' => '6'],
                ['name' => 'cucumber', 'unit' => 'whole', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Teriyaki Stir-Fry',
            'description' => 'Wok-fried vegetables and tofu in a sweet teriyaki glaze over rice.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'firm tofu', 'unit' => 'oz', 'quantity' => '14'],
                ['name' => 'broccoli', 'unit' => 'oz', 'quantity' => '8'],
                ['name' => 'teriyaki sauce', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'jasmine rice', 'unit' => 'cup', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Tuscan Sausage Pasta',
            'description' => 'Penne with Italian sausage, sun-dried tomatoes, and creamy garlic sauce.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'penne pasta', 'unit' => 'oz', 'quantity' => '12'],
                ['name' => 'Italian sausage', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'sun-dried tomatoes', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'heavy cream', 'unit' => 'cup', 'quantity' => '0.5'],
            ],
        ],
        [
            'name'        => 'Coconut Curry Chicken',
            'description' => 'Tender chicken simmered in coconut milk curry with jasmine rice.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'chicken thighs', 'unit' => 'lb', 'quantity' => '1.5'],
                ['name' => 'coconut milk', 'unit' => 'can', 'quantity' => '1'],
                ['name' => 'curry paste', 'unit' => 'tbsp', 'quantity' => '3'],
                ['name' => 'jasmine rice', 'unit' => 'cup', 'quantity' => '2'],
            ],
        ],
        [
            'name'        => 'Pan-Seared Pork Chops',
            'description' => 'Thick-cut pork chops with a honey-mustard pan sauce and steamed broccoli.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'bone-in pork chops', 'unit' => 'whole', 'quantity' => '4'],
                ['name' => 'honey', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'Dijon mustard', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'broccoli', 'unit' => 'oz', 'quantity' => '8'],
            ],
        ],
        [
            'name'        => 'Baked Ziti',
            'description' => 'Ziti pasta baked with ricotta, mozzarella, and slow-simmered meat sauce.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'ziti pasta', 'unit' => 'oz', 'quantity' => '16'],
                ['name' => 'ricotta cheese', 'unit' => 'oz', 'quantity' => '8'],
                ['name' => 'mozzarella', 'unit' => 'oz', 'quantity' => '8'],
                ['name' => 'ground beef', 'unit' => 'lb', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Chimichurri Flank Steak',
            'description' => 'Grilled flank steak sliced thin with fresh chimichurri and roasted corn.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'flank steak', 'unit' => 'lb', 'quantity' => '1.5'],
                ['name' => 'parsley', 'unit' => 'bunch', 'quantity' => '1'],
                ['name' => 'red wine vinegar', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'corn on the cob', 'unit' => 'whole', 'quantity' => '4'],
            ],
        ],
        [
            'name'        => 'Honey Soy Glazed Cod',
            'description' => 'Oven-baked cod with a honey-soy glaze, served with bok choy.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'cod fillets', 'unit' => 'lb', 'quantity' => '1'],
                ['name' => 'honey', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'soy sauce', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'bok choy', 'unit' => 'whole', 'quantity' => '4'],
            ],
        ],
        [
            'name'        => 'Eggplant Parmesan',
            'description' => 'Breaded eggplant layered with marinara and melted mozzarella.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'eggplant', 'unit' => 'whole', 'quantity' => '2'],
                ['name' => 'breadcrumbs', 'unit' => 'cup', 'quantity' => '1'],
                ['name' => 'marinara sauce', 'unit' => 'oz', 'quantity' => '12'],
                ['name' => 'mozzarella', 'unit' => 'oz', 'quantity' => '8'],
            ],
        ],
        [
            'name'        => 'Korean BBQ Short Ribs',
            'description' => 'Marinated beef short ribs grilled and served with kimchi and rice.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'beef short ribs', 'unit' => 'lb', 'quantity' => '2'],
                ['name' => 'soy sauce', 'unit' => 'tbsp', 'quantity' => '3'],
                ['name' => 'brown sugar', 'unit' => 'tbsp', 'quantity' => '2'],
                ['name' => 'sesame oil', 'unit' => 'tbsp', 'quantity' => '1'],
            ],
        ],
        [
            'name'        => 'Mushroom Risotto',
            'description' => 'Creamy arborio rice slowly cooked with porcini mushrooms and parmesan.',
            'meal_type'   => 'dinner',
            'ingredients' => [
                ['name' => 'arborio rice', 'unit' => 'cup', 'quantity' => '2'],
                ['name' => 'porcini mushrooms', 'unit' => 'oz', 'quantity' => '4'],
                ['name' => 'parmesan', 'unit' => 'oz', 'quantity' => '3'],
                ['name' => 'vegetable broth', 'unit' => 'cup', 'quantity' => '4'],
            ],
        ],
    ];
}
