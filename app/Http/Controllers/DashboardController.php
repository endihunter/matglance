<?php

namespace App\Http\Controllers;

use App\Repositories\QuotesRepository;
use Illuminate\Http\Request;

use App\Http\Requests;

class DashboardController extends Controller
{
    /**
     * @var QuotesRepository
     */
    protected $quotesRepository;

    public function __construct(QuotesRepository $quotesRepository)
    {
        $this->quotesRepository = $quotesRepository;
    }

    public function index()
    {
        return view('dashboard')
            ->with([
                'quote' => $this->quotesRepository->random()
            ]);
    }
}
