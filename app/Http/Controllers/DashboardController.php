<?php

namespace App\Http\Controllers;

use App\Repositories\CalendarRepository;
use App\Repositories\FeedsRepository;
use App\Repositories\QuotesRepository;
use App\Services\Calendar;
use Illuminate\Http\Request;

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
                'quote' => $this->quotes->random($me->lang()->id),
                'feeds' => $this->feeds->feeds($me->lang()->id),
                'calendars' => $this->calendar->calendars($me->email)
            ]);
    }
}
