<?php

use Illuminate\Database\Seeder;
use Terranet\Localizer\Models\Language;

class LanguageTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('languages')->delete();

        foreach ($this->langs() as $lang) {
            Language::create($lang);
        }
    }

    /**
     * Languages data provider
     *
     * @return array
     */
    protected function langs()
    {
        DB::table('languages')->delete();
        DB::table('languages')->truncate();

        return [
            ['title' => 'English', 'iso6391' => 'en', 'locale' => 'en_US', 'active' => true, 'is_default' => 1],
        ];
    }
}
