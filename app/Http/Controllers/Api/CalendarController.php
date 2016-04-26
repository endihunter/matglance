<?php

namespace App\Http\Controllers\Api;

use App\Services\Calendar;
use App\Transformers\CalendarTransformer;
use App\Transformers\EventTransformer;
use Auth;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CalendarController extends Controller
{
    public function calendars()
    {
        $me = Auth::guard('api')->user();

        return \Restable::listing(
            Calendar::of($me->email)->listCalendars(),
            new CalendarTransformer
        );
    }

    public function events(Request $request)
    {
        $me = Auth::guard('api')->user();

        return \Restable::listing(
            Calendar::of($me->email)->events($request->get('c')),
            new EventTransformer
        );
    }
}
