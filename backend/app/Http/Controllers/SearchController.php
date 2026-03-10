<?php

namespace App\Http\Controllers;

use App\Models\Manga;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->string('q', '');

        $results = Manga::query()
            ->where('title', 'like', "%{$q}%")
            ->orWhere('author', 'like', "%{$q}%")
            ->orWhere('artist', 'like', "%{$q}%")
            ->with('genres')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'data' => $results,
        ]);
    }
}
