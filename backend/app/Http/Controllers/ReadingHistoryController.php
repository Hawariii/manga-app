<?php

namespace App\Http\Controllers;

use App\Models\Manga;
use App\Models\Chapter;
use App\Models\ReadingHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReadingHistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $history = ReadingHistory::with(['manga', 'chapter'])
            ->where('user_id', $user->id)
            ->orderByDesc('updated_at')
            ->get();

        return response()->json(['data' => $history]);
    }

    public function topWeekly()
    {
        $since = Carbon::now()->subDays(7);

        $items = ReadingHistory::query()
            ->select('manga_id')
            ->selectRaw('COUNT(*) as read_count')
            ->where('updated_at', '>=', $since)
            ->groupBy('manga_id')
            ->orderByDesc('read_count')
            ->with('manga')
            ->limit(12)
            ->get();

        return response()->json(['data' => $items]);
    }

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
