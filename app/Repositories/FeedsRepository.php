<?php

namespace App\Repositories;

use App\NewsFeed;
use App\Services\FeedReader;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Zend\Feed\Reader\Reader;

class FeedsRepository
{
    public function feeds($lang)
    {
        return NewsFeed::ofLang($lang)->orderBy('name')->get(['id', 'name']);
    }

    public function news(array $feeds = [], $take = 300)
    {
        $collection = NewsFeed::whereIn('id', $feeds)->get(['url']);

        $news = Collection::make([]);

        foreach ($collection as $feed) {
            $news = $news->merge($this->parse($feed));
        }

        $news->sort(function ($a, $b) {
            return $a['pubDate']->lt($b['pubDate']);
        });

        return $news->take($take);
    }

    protected function parse(NewsFeed $feed)
    {
        $cacheKey = md5($feed->url);

        return \Cache::remember($cacheKey, 20, function () use ($feed) {
            $reader = Reader::importString(
                file_get_contents($feed->url)
            );

            $data = [];

            foreach ($reader as $key => $item) {
                array_push($data, [
                    'title' => $item->getTitle(),
                    'link' => $item->getLink(),
                    'content' => strip_tags(html_entity_decode($item->getContent())),
                    'enclosure' => $item->getEnclosure(),
                    'pubDate' => Carbon::parse($item->getDateModified()->format('Y-m-d H:i:s')),
                    'media' => get_rss_media($item, $key),
                ]);
            }

            return $data;
        });
    }
}