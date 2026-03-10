<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Manga;
use App\Models\Chapter;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, Manga $manga)
    {
        $query = Comment::query()->where('manga_id', $manga->id)->with('user');

        if ($request->filled('chapter')) {
            $chapter = Chapter::where('manga_id', $manga->id)
                ->where('slug', $request->string('chapter'))
                ->first();

            if ($chapter) {
                $query->where('chapter_id', $chapter->id);
            }
        }

        $comments = $query->orderBy('created_at', 'desc')->paginate(30);

        return response()->json([
            'data' => $comments,
        ]);
    }

    public function store(Request $request, Manga $manga)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:2000',
            'chapter_slug' => 'nullable|string',
        ]);

        $chapterId = null;
        if (!empty($validated['chapter_slug'])) {
            $chapter = Chapter::where('manga_id', $manga->id)
                ->where('slug', $validated['chapter_slug'])
                ->first();
            $chapterId = $chapter?->id;
        }

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'manga_id' => $manga->id,
            'chapter_id' => $chapterId,
            'body' => $validated['body'],
        ]);

        return response()->json([
            'data' => $comment,
        ], 201);
    }

    public function destroy(Request $request, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }
}
