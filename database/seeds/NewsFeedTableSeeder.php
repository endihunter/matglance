<?php

use Illuminate\Database\Seeder;

class NewsFeedTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('news_feeds')->truncate();

        foreach ($this->feeds() as $feed) {
            \App\NewsFeed::create($feed);
        }
    }

    private function feeds()
    {
        $feeds = [
            [
                'id' => 1,
                'lang_id' => 1,
                'title' => 'BBC World News',
                'url' => 'http://feeds.bbci.co.uk/news/world/rss.xml',
                'categories' => 'world news',
            ],
            [
                'id' => 2,
                'lang_id' => 1,
                'title' => 'BBC BBC Politics',
                'url' => 'http://feeds.bbci.co.uk/news/politics/rss.xml',
                'categories' => 'politics',
            ],
            [
                'id' => 3,
                'lang_id' => 1,
                'title' => 'BBC Technology',
                'url' => 'http://feeds.bbci.co.uk/news/video_and_audio/technology/rss.xml',
                'categories' => 'technology',
            ],
            [
                'id' => 4,
                'lang_id' => 1,
                'title' => 'BBC Health',
                'url' => 'http://feeds.bbci.co.uk/news/health/rss.xml',
                'categories' => 'health',
            ],
            [
                'id' => 5,
                'lang_id' => 1,
                'title' => 'BBC Entertainment & Arts',
                'url' => 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
                'categories' => 'entertainment,arts',
            ],
            [
                'id' => 6,
                'lang_id' => 1,
                'title' => 'NY Post',
                'url' => 'http://nypost.com/news/feed/',
                'categories' => 'news',
            ],
            [
                'id' => 7,
                'lang_id' => 1,
                'title' => 'NY Times',
                'url' => 'http://rss.nytimes.com/services/xml/rss/nyt/Baseball.xml',
                'categories' => 'sports, baseball',
            ],
            [
                'id' => 8,
                'lang_id' => 1,
                'title' => 'UEFA Champions League',
                'url' => 'http://www.uefa.com/rssfeed/uefachampionsleague/rss.xml',
                'categories' => 'sports, football',
            ],
        ];

        return $feeds;
    }
}
