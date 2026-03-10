<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Manga;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function index(Request $request)
    {
        $bookmarks = Bookmark::query()
            ->where('user_id', $request->user()->id)
            ->with('manga.genres')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $bookmarks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'manga_id' => 'nullable|exists:mangas,id',
            'manga_slug' => 'nullable|string',
        ]);

        $manga = null;
        if (!empty($validated['manga_id'])) {
            $manga = Manga::find($validated['manga_id']);
        } elseif (!empty($validated['manga_slug'])) {
            $manga = Manga::where('slug', $validated['manga_slug'])->first();
        }

        if (!$manga) {
            return response()->json(['message' => 'Manga not found.'], 404);
        }

        $bookmark = Bookmark::firstOrCreate([
            'user_id' => $request->user()->id,
            'manga_id' => $manga->id,
        ]);

        return response()->json([
            'data' => $bookmark,
        ], 201);
    }

    public function destroy(Request $request, Bookmark $bookmark)
    {
        if ($bookmark->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $bookmark->delete();

        return response()->json(['message' => 'Bookmark removed.']);
    }
}
