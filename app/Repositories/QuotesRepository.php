<?php

namespace App\Repositories;

use App\Quote;

class QuotesRepository
{
    /**
     * Fetch random quote
     *
     * @return mixed
     */
    public function random($langId = null)
    {
        $builder = new Quote;

        if (! $langId && auth()->check()) {
            $me = auth()->user();
            $langId = $me->lang()->id;
        }

        if ($langId) {
            $builder = $builder->forLang($langId);
        }

        return $builder->get()->random(1);
    }
}