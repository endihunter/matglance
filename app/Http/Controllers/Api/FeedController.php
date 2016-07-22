<?php

namespace App\Http\Controllers\Api;

use App\Repositories\FeedsRepository;
use Auth;
use Illuminate\Http\Request;
use Zend\Feed\Reader\Reader;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Restable;
use App\NewsFeed;

class FeedController extends Controller
{
    /**
     * @var FeedsRepository
     */
    private $news;

    public function __construct(FeedsRepository $news)
    {
        $this->news = $news;
    }

    public function news(Request $request)
    {
        $me = Auth::guard('api')->user();

        $feedList = $this->getFeedsList($request, $me);

        return Restable::listing($this->news->news($feedList), function ($item) {
            return array_merge($item, [
                'pubDate' => $item['pubDate'],
            ]);
        });
    }

    /**
     * @param Request $request
     * @param $me
     * @return array
     */
    protected function getFeedsList(Request $request, $me)
    {
        $feedList = ($ids = $request->get('ids', [])) ? explode(",", $ids) : [];
        if (empty($feedList)) {
            $feedList = $this->news->feeds($me->lang(), $me)->pluck('id')->toArray();

            return $feedList;
        }

        return $feedList;
    }

    public function postFeed(Request $request) {
        $reader = Reader::importString(
            file_get_contents($request->get('url'))
        );

        $me = Auth::guard('api')->user();
        $feed = NewsFeed::create([
            'user_id' => $me->id,
            'name' => $request->get('name'),
            'url' => $request->get('url'),
        ]);

        return response()->json([
            'data' => $feed,
        ]);
    }
}
