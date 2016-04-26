<?php

namespace App\Http\Controllers;

use App\Repositories\CalendarRepository;
use App\Repositories\FeedsRepository;
use App\Repositories\QuotesRepository;

use App\Http\Requests;

class DashboardController extends Controller
{
    /**
     * @var QuotesRepository
     */
    private $quotes;
    /**
     * @var FeedsRepository
     */
    private $feeds;
    /**
     * @var CalendarRepository
     */
    private $calendar;

    public function __construct(QuotesRepository $quotes, FeedsRepository $feeds, CalendarRepository $calendar)
    {
        $this->quotes = $quotes;
        $this->feeds = $feeds;
        $this->calendar = $calendar;
    }

    public function index()
    {
        $me = auth()->user();

        $view = view('dashboard', [
            'quote' => $this->quotes->random($me->lang()),
            'feeds' => $this->feeds->feeds($me->lang()),
            'calendars' => $this->calendar->calendars($me->email),
        ]);

        return response($view, 200, [
            'Last-Modified' => gmdate("D, d M Y H:i:s") . ' GMT',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
            'Pragma' => 'no-cache',
            'Expires' => 'Mon, 26 Jul 1997 05:00:00 GMT',
        ]);
    }
}
