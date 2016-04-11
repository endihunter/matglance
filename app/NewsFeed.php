<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NewsFeed extends Model
{
    protected $fillable = [
        'lang_id', 'name', 'url', 'categories',
    ];

    public function scopeOfLang($query, $langId)
    {
        return $query->where('lang_id', (int) $langId);
    }

    public function categories()
    {
        $keys = explode(',', $this->categories) ?: [];
        $keys = array_map('trim', $keys);

        $values = array_map(function ($value) {
            return title_case($value);
        }, $keys);

        return array_combine($keys, $values);
    }
}
