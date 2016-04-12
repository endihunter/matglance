<?php

namespace App\Http\Controllers\Api;

use App\Repositories\FeedsRepository;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Restable;

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
        $me = auth()->user();

        $feedList = $this->getFeedsList($request, $me);

        return Restable::listing($this->news->news($feedList), function ($item) {
            return array_merge($item, [
                'pubDate' => $item['pubDate']->diffForHumans(),
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
            $feedList = $this->news->feeds($me->lang())->pluck('id')->toArray();

            return $feedList;
        }

        return $feedList;
    }
}
