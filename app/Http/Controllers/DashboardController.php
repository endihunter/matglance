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

        return view('dashboard')
            ->with([
                'quote' => $this->quotes->random($me->lang()),
                'feeds' => $this->feeds->feeds($me->lang()),
                'calendars' => $this->calendar->calendars($me->email)
            ]);
    }
}
