<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manga extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'author',
        'artist',
        'status',
    ];

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('number');
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'manga_genres');
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
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
