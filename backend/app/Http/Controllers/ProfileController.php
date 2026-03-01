<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Cloudinary\Cloudinary;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        dd(
            $request->all(),
            $request->hasFile('photo'),
            $request->file('photo')
        );

        $validated = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'phone' => 'nullable|string|max:20',
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
