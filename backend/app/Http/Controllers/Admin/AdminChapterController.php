<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Manga;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminChapterController extends Controller
{
    public function store(Request $request, Manga $manga)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'number' => 'required|integer|min:1',
            'published_at' => 'nullable|date',
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['title']);

        $chapter = Chapter::create([
            'manga_id' => $manga->id,
            'title' => $validated['title'],
            'slug' => $slug,
            'number' => $validated['number'],
            'published_at' => $validated['published_at'] ?? null,
        ]);

        return response()->json([
            'data' => $chapter,
        ], 201);
    }

    public function update(Request $request, Manga $manga, Chapter $chapter)
    {
        if ($chapter->manga_id !== $manga->id) {
            return response()->json(['message' => 'Chapter not found for this manga.'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255',
            'number' => 'sometimes|required|integer|min:1',
            'published_at' => 'nullable|date',
        ]);

        $chapter->update($validated);

        return response()->json([
            'data' => $chapter,
        ]);
    }

    public function destroy(Manga $manga, Chapter $chapter)
    {
        if ($chapter->manga_id !== $manga->id) {
            return response()->json(['message' => 'Chapter not found for this manga.'], 404);
        }

        $chapter->delete();

        return response()->json(['message' => 'Chapter deleted.']);
    }

    public function uploadImages(Request $request, Manga $manga, Chapter $chapter)
    {
        if ($chapter->manga_id !== $manga->id) {
            return response()->json(['message' => 'Chapter not found for this manga.'], 404);
        }

        $validated = $request->validate([
            'images' => 'required|array',
            'images.*' => 'required|image|max:10240',
            'replace' => 'nullable|boolean',
        ]);

        if (!empty($validated['replace']) && $validated['replace']) {
            Page::where('chapter_id', $chapter->id)->delete();
        }

        $stored = [];
        $sequence = 1;

        foreach ($request->file('images') as $file) {
            $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $ext = $file->getClientOriginalExtension();

            preg_match('/(\d+)/', $name, $matches);
            $pageNumber = !empty($matches) ? (int) $matches[1] : $sequence;

            $filename = str_pad((string) $pageNumber, 3, '0', STR_PAD_LEFT) . ".{$ext}";
            $path = "manga/{$manga->slug}/{$chapter->slug}/{$filename}";

            Storage::disk('local')->put($path, file_get_contents($file));

            $page = Page::updateOrCreate(
                ['chapter_id' => $chapter->id, 'page_number' => $pageNumber],
                ['image_path' => $path]
            );

            $stored[] = $page;
            $sequence++;
        }

        return response()->json([
            'data' => [
                'chapter' => $chapter,
                'pages' => $stored,
            ],
        ], 201);
    }
}
