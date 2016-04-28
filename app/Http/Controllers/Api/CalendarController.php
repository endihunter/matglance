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

        $events = $this->fetchEvents($me->email, $request->get('c'), $request->get('t'), $request->get('tz'));

        $events = array_map([new EventTransformer, 'transform'], $events->getItems());

        $events = $this->datify($events);

        return response()->json([
            'data' => $events,
        ]);
    }

    private function fetchEvents($email, $calendar, $time, $timeZoneOffset)
    {
        return Calendar::of($email)->events($calendar, $time, $timeZoneOffset);
    }

    private function datify($events)
    {
        $out = array_reduce($events, function ($out, $item) {
            $date = strtotime($item['start']['date']);
            if (!array_has($out, $date)) {
                $out[$date] = [
                    'date' => $item['start']['date'],
                    'events' => [],
                ];
            }
            $out[$date]['events'][] = $item;

            return $out;
        }, []);

        return $out;
    }
}
