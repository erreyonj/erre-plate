<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Cloudinary\Cloudinary;
use App\Models\ChefProfile;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function showPublicChef(string $slug)
    {
        $chefProfile = ChefProfile::with('user')
            ->where('status', 'approved')
            ->where('is_paused', false)
            ->where('slug', $slug)
            ->first();

        if (!$chefProfile) {
            return response()->json(['message' => 'Chef profile not found'], 404);
        }

        return response()->json($chefProfile);
    }

    public function index(Request $request)
    {
        $neighborhoodId = $request->query('neighborhood');
        $chefsQuery = ChefProfile::with('user')
        ->where('status', 'approved')
        // ->where('is_available', true)
        ->when($neighborhoodId, function ($query) use ($neighborhoodId) {
            $query->whereHas('user', function ($q) use ($neighborhoodId) {
                $q->where('neighborhood_id', $neighborhoodId);
            });
        })
        ->get();

        return response()->json($chefsQuery);
    }

    public function indexByNeighborhood(Request $request)
    {
        $neighborhoodId = $request->query('neighborhood');
        $chefsQuery = ChefProfile::with('user')
        ->where('status', 'approved')
        // ->where('is_available', true)
        ->when($neighborhoodId, function ($query) use ($neighborhoodId) {
            $query->whereHas('user', function ($q) use ($neighborhoodId) {
                $q->where('neighborhood_id', $neighborhoodId);
            });
        })
        ->get();

        return response()->json($chefsQuery->latest()->paginate(20));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'phone' => 'nullable|string|max:20',
            'dietary_preferences' => 'nullable|string|max:255',
            'allergies' => 'nullable|string|max:255',
            'address' => 'nullable|array',
            'address.street' => 'nullable|string|max:255',
            'address.city' => 'nullable|string|max:255',
            'address.state' => 'nullable|string|max:255',
            'address.zip' => 'nullable|string|max:20',
            'address.country' => 'nullable|string|max:255',
            'address.lat' => 'nullable|numeric',
            'address.lng' => 'nullable|numeric',
        ]);

        $request->user()->update($validated);

        return response()->json($request->user());
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
