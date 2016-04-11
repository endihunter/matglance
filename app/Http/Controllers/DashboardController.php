<?php

namespace App\Http\Controllers;

use App\Repositories\FeedsRepository;
use App\Repositories\QuotesRepository;
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

    public function __construct(QuotesRepository $quotes, FeedsRepository $feeds)
    {
        $this->quotes = $quotes;
        $this->feeds = $feeds;
    }

    public function index()
    {
        $me = auth()->user();

        return view('dashboard')
            ->with([
                'quote' => $this->quotes->random($me->lang()->id),
                'feeds' => $this->feeds->feeds($me->lang()->id)
            ]);
    }
}
