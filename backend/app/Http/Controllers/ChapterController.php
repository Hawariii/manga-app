<?php

namespace App\Http\Controllers;

use App\Models\Manga;
use App\Models\Chapter;

class ChapterController extends Controller
{
    public function show(Manga $manga, Chapter $chapter)
    {
        if ($chapter->manga_id !== $manga->id) {
            return response()->json(['message' => 'Chapter not found for this manga.'], 404);
        }

        $chapter->load('pages');

        return response()->json([
            'data' => [
                'manga' => $manga,
                'chapter' => $chapter,
            ],
        ]);
    }
}
