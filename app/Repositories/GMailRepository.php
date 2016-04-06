<?php

namespace App\Repositories;

use App\Services\Gmail;
use Cache;
use Illuminate\Http\Request;

class GMailRepository
{
    protected $cacheCollectionFor = 0;
    protected $cacheMessageFor = 24 * 60;

    /**
     * Fetch GMail messages
     *
     * @param $userId
     * @param Request $request
     */
    public function lists($userId, Request $request)
    {
        $cacheKey = $this->collectionCacheKey($userId, $request);

        Cache::forget($cacheKey);

        return Cache::remember($cacheKey, $this->cacheCollectionFor, function () use ($userId, $request) {
            return $this->fetchRemoteMessages($userId, $request);
        });
    }

    public function get($userId, $messageId)
    {
        $cacheKey = "{$userId}_{$messageId}_message";
        $cacheKey = md5($cacheKey);

        return Cache::remember($cacheKey, $this->cacheMessageFor, function () use ($userId, $messageId) {
            return $this->fetchSingleMessage($userId, $messageId);
        });
    }

    public function touch($userId, $messageId)
    {
        $gMail = Gmail::of($userId);

        return $gMail->touch($messageId);
    }

    /**
     * Fetch remote messages
     *
     * @param $userId string
     * @param Request $request
     * @return mixed
     */
    protected function fetchRemoteMessages($userId, Request $request)
    {
        $gMail = Gmail::of($userId);

        return $gMail
            ->match($request->get('q', null))
            ->withSpamTrash((bool) $request->get('includeSpamTrash', false))
            ->take((int) $request->get('maxResults', 5))
            ->messages();
    }

    /**
     * Fetch remote messages
     *
     * @param $userId string
     * @param $messageId
     * @return mixed
     */
    protected function fetchSingleMessage($userId, $messageId)
    {
        $gMail = Gmail::of($userId);

        return $gMail->get($messageId);
    }

    /**
     * @param $userId
     * @param Request $request
     * @return string
     */
    protected function collectionCacheKey($userId, Request $request)
    {
        $cacheKey = "{$userId}_"
            . join("_", $request->all()) . "_"
            . "messages";

        return md5($cacheKey);
    }
}