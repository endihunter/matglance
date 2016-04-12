<?php

namespace App\Repositories;

use Terranet\Localizer\Models\Language;

class LanguagesRepository
{
    public function active()
    {
        return Language::active()->orderBy('id')->get();
    }
}