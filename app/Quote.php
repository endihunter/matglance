<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'lang_id', 'show_at', 'quote', 'author'
    ];

    public function scopeForLang($query, $langId)
    {
        return $query->where('lang_id', (int) $langId);
    }
}
