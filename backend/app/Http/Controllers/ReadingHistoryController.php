<?php

namespace App\Http\Controllers;

use App\Models\Manga;
use App\Models\Chapter;
use App\Models\ReadingHistory;
use Illuminate\Http\Request;

class ReadingHistoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'manga_slug' => 'required|string',
            'chapter_slug' => 'required|string',
            'page_number' => 'required|integer|min:1',
        ]);

        $manga = Manga::where('slug', $validated['manga_slug'])->first();
        if (!$manga) {
            return response()->json(['message' => 'Manga not found.'], 404);
        }

        $chapter = Chapter::where('manga_id', $manga->id)
            ->where('slug', $validated['chapter_slug'])
            ->first();

        if (!$chapter) {
            return response()->json(['message' => 'Chapter not found.'], 404);
        }

        if (!$request->user()) {
            return response()->json(['message' => 'Progress received.']);
        }

        $history = ReadingHistory::updateOrCreate(
            ['user_id' => $request->user()->id, 'manga_id' => $manga->id],
            ['chapter_id' => $chapter->id, 'page_number' => $validated['page_number']]
        );

        return response()->json(['data' => $history]);
    }
}
