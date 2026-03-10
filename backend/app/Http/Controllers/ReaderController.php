<?php

namespace App\Http\Controllers;

use App\Models\Manga;
use App\Models\Chapter;

class ReaderController extends Controller
{
    public function read(Manga $manga, Chapter $chapter)
    {
        if ($chapter->manga_id !== $manga->id) {
            return response()->json(['message' => 'Chapter not found for this manga.'], 404);
        }

        $chapter->load('pages');

        $prev = $manga->chapters()->where('number', '<', $chapter->number)->orderBy('number', 'desc')->first();
        $next = $manga->chapters()->where('number', '>', $chapter->number)->orderBy('number', 'asc')->first();

        return response()->json([
            'data' => [
                'manga' => $manga,
                'chapter' => $chapter,
                'pages' => $chapter->pages,
                'prev_chapter' => $prev,
                'next_chapter' => $next,
            ],
        ]);
    }
}
