<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use App\Models\Manga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminMangaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'artist' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
            'cover_image' => 'nullable|image|max:5120',
            'genre_ids' => 'nullable|array',
            'genre_ids.*' => 'integer|exists:genres,id',
            'genre_slugs' => 'nullable|array',
            'genre_slugs.*' => 'string',
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['title']);

        $manga = Manga::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'author' => $validated['author'] ?? null,
            'artist' => $validated['artist'] ?? null,
            'status' => $validated['status'] ?? 'ongoing',
        ]);

        if ($request->hasFile('cover_image')) {
            $ext = $request->file('cover_image')->getClientOriginalExtension();
            $path = "manga/{$manga->slug}/cover.{$ext}";
            Storage::disk('public')->put($path, file_get_contents($request->file('cover_image')));
            $manga->update(['cover_image' => $path]);
        }

        $genreIds = $validated['genre_ids'] ?? [];
        if (!empty($validated['genre_slugs'])) {
            $extraIds = Genre::whereIn('slug', $validated['genre_slugs'])->pluck('id')->toArray();
            $genreIds = array_values(array_unique(array_merge($genreIds, $extraIds)));
        }
        if (!empty($genreIds)) {
            $manga->genres()->sync($genreIds);
        }

        return response()->json([
            'data' => $manga->load('genres'),
        ], 201);
    }

    public function update(Request $request, Manga $manga)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'artist' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
            'cover_image' => 'nullable|image|max:5120',
            'genre_ids' => 'nullable|array',
            'genre_ids.*' => 'integer|exists:genres,id',
        ]);

        $manga->update($validated);

        if ($request->hasFile('cover_image')) {
            $ext = $request->file('cover_image')->getClientOriginalExtension();
            $path = "manga/{$manga->slug}/cover.{$ext}";
            Storage::disk('public')->put($path, file_get_contents($request->file('cover_image')));
            $manga->update(['cover_image' => $path]);
        }

        if (array_key_exists('genre_ids', $validated)) {
            $manga->genres()->sync($validated['genre_ids'] ?? []);
        }

        return response()->json([
            'data' => $manga->load('genres'),
        ]);
    }

    public function destroy(Manga $manga)
    {
        $manga->delete();

        return response()->json(['message' => 'Manga deleted.']);
    }
}
