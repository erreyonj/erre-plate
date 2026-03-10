<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Cloudinary\Cloudinary;
use App\Models\ChefProfile;
use App\Models\Neighborhood;
use App\Models\WeeklyMenu;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\PublicChefProfileResource;
use App\Http\Resources\WeeklyMenuIndexResource;
use App\Http\Resources\WeeklyMenuResource;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function showPublicChef(string $slug)
    {
        $chef = ChefProfile::with('user')
            ->where('status', 'approved')
            ->where('is_paused', false)
            ->where('slug', $slug)
            ->first();

        if (!$chef) {
            return response()->json(['message' => 'Chef profile not found'], 404);
        }

        // Featured menu
        $featuredMenu = WeeklyMenu::with('assignedDishes.dish.photos')
            ->where('chef_profile_id', $chef->id)
            ->where('status', 'published')
            ->where('is_default', true)
            ->first();

        // Other menus
        $weeklyMenus = WeeklyMenu::with('assignedDishes.dish.photos')
            ->where('chef_profile_id', $chef->id)
            ->where('status', 'published')
            ->where('is_default', false)
            ->get();

        return response()->json([
            'chef' => new PublicChefProfileResource($chef),
            'featured_menu' => $featuredMenu
                ? new WeeklyMenuResource($featuredMenu)
                : null,
            'weekly_menus' => WeeklyMenuIndexResource::collection($weeklyMenus),
        ]);
    }

    public function showPublicMenu(WeeklyMenu $menu)
    {
        abort_if($menu->status !== 'published', 404);

        $menu->load('assignedDishes.dish.photos', 'chefProfile.user');

        return new WeeklyMenuResource($menu);
    }

    public function index(Request $request)
    {
        $validated = $request->validate([
            'neighborhood' => 'nullable|string',
            'cuisine'      => 'nullable|string|max:100',
            'rating'       => 'nullable|numeric|min:1|max:5',
            'search'       => 'nullable|string|max:100',
        ]);

        $neighborhoodId = $validated['neighborhood'] ?? null;

        if ($neighborhoodId === 'all') {
            $neighborhoodId = null;
        }

        $chefs = ChefProfile::query()
            ->with('user')
            ->where('status', 'approved')
            ->where('is_paused', false)

            ->when(is_numeric($neighborhoodId), function ($q) use ($neighborhoodId) {
                $q->whereHas('user', function ($sub) use ($neighborhoodId) {
                    $sub->where('neighborhood_id', $neighborhoodId);
                });
            })

            ->when(!empty($validated['search']), function ($q) use ($validated) {
                $term = $validated['search'];
                $q->where(function ($sub) use ($term) {
                    $sub->where('bio', 'like', "%{$term}%")
                        ->orWhere('tagline', 'like', "%{$term}%")
                        ->orWhereJsonContains('specialties', $term)
                        ->orWhereHas('user', function ($user) use ($term) {
                            $user->where('first_name', 'like', "%{$term}%")
                                 ->orWhere('last_name', 'like', "%{$term}%");
                        });
                });
            })

            ->when(!empty($validated['cuisine']), function ($q) use ($validated) {
                $q->whereJsonContains('specialties', $validated['cuisine']);
            })

            ->when(!empty($validated['rating']), function ($q) use ($validated) {
                $q->where('rating_average', '>=', $validated['rating']);
            })

            ->latest()
            ->paginate(20);

        return PublicChefProfileResource::collection($chefs);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'phone' => 'nullable|string|max:20',
            'dietary_preferences' => 'nullable|array',
            'dietary_preferences.*' => 'string|max:255',
            'allergies' => 'nullable|array',
            'allergies.*' => 'string|max:255',
            'address' => 'nullable|array',
            'address.street' => 'nullable|string|max:255',
            'address.city' => 'nullable|string|max:255',
            'address.state' => 'nullable|string|max:255',
            'address.zip' => 'nullable|string|max:20',
            'address.country' => 'nullable|string|max:255',
            'address.lat' => 'nullable|numeric',
            'address.lng' => 'nullable|numeric',
        ]);

        return DB::transaction(function () use ($validated, $request) {

            $user = $request->user();
    
            $user->update($validated);
    
            $zip = $validated['address']['zip'] ?? null;
    
            if ($zip) {
                $neighborhood = Neighborhood::where('zip_code', $zip)->first();
                $user->neighborhood_id = $neighborhood?->id;
            } else {
                $user->neighborhood_id = null;
            }
    
            $user->save();
    
            return response()->json(
                $user->load('neighborhood')
            );
        });
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:5120', // 5MB max
        ]);

        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key' => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
        ]);

        $uploadedFile = $request->file('photo');
        
        $result = $cloudinary->uploadApi()->upload(
            $uploadedFile->getRealPath(),
            [
                'folder' => 'erreplate/profiles',
                'transformation' => [
                    'width' => 400,
                    'height' => 400,
                    'crop' => 'fill',
                    'gravity' => 'face',
                ]
            ]
        );

        $user = $request->user();
        $user->photo_url = $result['secure_url'];
        $user->save();

        return response()->json([
            'photo_url' => $result['secure_url']
        ]);
    }
}
