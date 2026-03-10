<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    use HasFactory;

    protected $fillable = [
        'manga_id',
        'title',
        'slug',
        'number',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function manga()
    {
        return $this->belongsTo(Manga::class);
    }

    public function pages()
    {
        return $this->hasMany(Page::class)->orderBy('page_number');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function readingHistory()
    {
        return $this->hasMany(ReadingHistory::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
