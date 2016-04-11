<?php

namespace App\Http\Controllers\Api;

use App\Services\Calendar;
use App\Transformers\CalendarTransformer;
use App\Transformers\EventTransformer;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CalendarController extends Controller
{
    public function calendars()
    {
        $me = auth()->user();

        return \Restable::listing(
            Calendar::of($me->email)->listCalendars(),
            new CalendarTransformer
        );
    }

    public function events(Request $request)
    {
        $me = auth()->user();

        return \Restable::listing(
            Calendar::of($me->email)->events($request->get('c')),
            new EventTransformer
        );
    }
}
