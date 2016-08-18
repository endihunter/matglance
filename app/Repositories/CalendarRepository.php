<?php

namespace App\Repositories;

use App\Services\Calendar;
use App\Transformers\CalendarTransformer;

class CalendarRepository
{
    public function calendars($userId)
    {
        $calendars = Calendar::of($userId)->listCalendars()->getItems();

        $primaryCalendar = array();
        $ownCalendars = array();
        $readerCalendars = array();
        foreach ($calendars as $calendar) {
            if($calendar['primary'] == true) {
                $calendar['summary'] = auth()->user()->name;
                array_push($primaryCalendar, $calendar);
            } else {
                if($calendar['accessRole'] == 'owner') {
                    array_push($ownCalendars, $calendar);
                } else {
                    array_push($readerCalendars, $calendar);
                }
            }
        }

        usort($readerCalendars, [$this, 'sortByName']);
        usort($ownCalendars, [$this, 'sortByName']);
        usort($primaryCalendar, [$this, 'sortByName']);

        $result = array();
        array_push($result, $primaryCalendar);
        array_push($result, $ownCalendars);
        array_push($result, $readerCalendars);

        $result = array_collapse($result);

        return array_map(
            [$this, 'calendar'],
            $result
        );
    }

    protected function calendar($calendar)
    {
        return (new CalendarTransformer)->transform($calendar);
    }

    protected function sortByName($a, $b) {
        return ($a['summary'] > $b['summary']) ? 1 : -1;
    }
}