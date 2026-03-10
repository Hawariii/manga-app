<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MangaController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\ReaderController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReadingHistoryController;
use App\Http\Controllers\Admin\AdminMangaController;
use App\Http\Controllers\Admin\AdminChapterController;

Route::get('/manga', [MangaController::class, 'index']);
Route::get('/manga/{manga}', [MangaController::class, 'show']);
Route::get('/manga/{manga}/chapters', [MangaController::class, 'chapters']);
Route::get('/manga/{manga}/chapters/{chapter}', [ChapterController::class, 'show']);
Route::get('/reader/manga/{manga}/chapters/{chapter}', [ReaderController::class, 'read']);

Route::get('/search', [SearchController::class, 'index']);
Route::post('/reading-history', [ReadingHistoryController::class, 'store']);

Route::get('/manga/{manga}/comments', [CommentController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/manga/{manga}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    Route::get('/bookmarks', [BookmarkController::class, 'index']);
    Route::post('/bookmarks', [BookmarkController::class, 'store']);
    Route::delete('/bookmarks/{bookmark}', [BookmarkController::class, 'destroy']);
});

// Admin endpoints (remove or protect with auth middleware in production)
Route::prefix('/admin')->group(function () {
    Route::post('/manga', [AdminMangaController::class, 'store']);
    Route::put('/manga/{manga}', [AdminMangaController::class, 'update']);
    Route::delete('/manga/{manga}', [AdminMangaController::class, 'destroy']);

    Route::post('/manga/{manga}/chapters', [AdminChapterController::class, 'store']);
    Route::put('/manga/{manga}/chapters/{chapter}', [AdminChapterController::class, 'update']);
    Route::delete('/manga/{manga}/chapters/{chapter}', [AdminChapterController::class, 'destroy']);
    Route::post('/manga/{manga}/chapters/{chapter}/images', [AdminChapterController::class, 'uploadImages']);
});
