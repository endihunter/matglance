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
                'language' => 'en',
                'name' => 'BBC World News',
                'url' => 'http://feeds.bbci.co.uk/news/world/rss.xml',
                'categories' => 'world news',
            ],
            [
                'id' => 2,
                'language' => 'en',
                'name' => 'BBC BBC Politics',
                'url' => 'http://feeds.bbci.co.uk/news/politics/rss.xml',
                'categories' => 'politics',
            ],
            [
                'id' => 3,
                'language' => 'en',
                'name' => 'BBC Technology',
                'url' => 'http://feeds.bbci.co.uk/news/video_and_audio/technology/rss.xml',
                'categories' => 'technology',
            ],
            [
                'id' => 4,
                'language' => 'en',
                'name' => 'BBC Health',
                'url' => 'http://feeds.bbci.co.uk/news/health/rss.xml',
                'categories' => 'health',
            ],
            [
                'id' => 5,
                'language' => 'en',
                'name' => 'BBC Entertainment & Arts',
                'url' => 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
                'categories' => 'entertainment,arts',
            ],
            [
                'id' => 6,
                'language' => 'en',
                'name' => 'NY Post',
                'url' => 'http://nypost.com/news/feed/',
                'categories' => 'news',
            ],
            [
                'id' => 7,
                'language' => 'en',
                'name' => 'NY Times',
                'url' => 'http://rss.nytimes.com/services/xml/rss/nyt/Baseball.xml',
                'categories' => 'sports, baseball',
            ],
            [
                'id' => 8,
                'language' => 'en',
                'name' => 'UEFA Champions League',
                'url' => 'http://www.uefa.com/rssfeed/uefachampionsleague/rss.xml',
                'categories' => 'sports, football',
            ],
            [
                'id' => 9,
                'language' => 'de',
                'name' => 'Google News Deutsche',
                'url' => 'http://news.google.de/news?cf=all&hl=de&pz=1&ned=de&topic=h&num=3&output=rss',
                'categories' => 'world',
            ],
        ];

        return $feeds;
    }
}
