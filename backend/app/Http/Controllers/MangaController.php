<?php

namespace App\Http\Controllers;

use App\Models\Manga;
use App\Models\Genre;
use Illuminate\Http\Request;

class MangaController extends Controller
{
    public function index(Request $request)
    {
        $query = Manga::query()->with('genres');

        if ($request->filled('q')) {
            $q = $request->string('q');
            $query->where('title', 'like', "%{$q}%");
        }

        if ($request->filled('genre')) {
            $genre = Genre::where('slug', $request->string('genre'))->first();
            if ($genre) {
                $query->whereHas('genres', fn ($g) => $g->where('genres.id', $genre->id));
            }
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        $mangas = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'data' => $mangas,
        ]);
    }

    public function show(Manga $manga)
    {
        $manga->load(['genres', 'chapters']);

        return response()->json([
            'data' => $manga,
        ]);
    }

    public function chapters(Manga $manga)
    {
        $chapters = $manga->chapters()->get();

        return response()->json([
            'data' => [
                'manga' => $manga,
                'chapters' => $chapters,
            ],
        ]);
    }
}
