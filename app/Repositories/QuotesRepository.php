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
    public function random()
    {
        return Quote::all()->random(1);
    }
}