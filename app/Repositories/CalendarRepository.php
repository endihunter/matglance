<?php

namespace App\Repositories;

use App\Services\Calendar;
use App\Transformers\CalendarTransformer;

class CalendarRepository
{
    public function calendars($userId)
    {
        return array_map(
            [$this, 'calendar'],
            Calendar::of($userId)->listCalendars()->getItems()
        );
    }

    protected function calendar($calendar)
    {
        return (new CalendarTransformer)->transform($calendar);
    }
}