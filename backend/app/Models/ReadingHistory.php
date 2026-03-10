<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReadingHistory extends Model
{
    use HasFactory;

    protected $table = 'reading_history';

    protected $fillable = [
        'user_id',
        'manga_id',
        'chapter_id',
        'page_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function manga()
    {
        return $this->belongsTo(Manga::class);
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }
}
