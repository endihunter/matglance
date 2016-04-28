<?php

namespace App\Services;

use Carbon\Carbon;
use Google_Service_Calendar;

class Calendar
{
    protected $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    static public function of($email)
    {
        return new static($email);
    }

    public function listCalendars()
    {
        return app('google.calendar')->calendarList->listCalendarList();
    }

    public function events($calendarId)
    {
        return app('google.calendar.api')->events->listEvents($calendarId, [
            'showDeleted' => false,
            'singleEvents' => true,
            'orderBy' => 'startTime',
            'timeMin' => Carbon::today()->toRfc3339String(),
            'timeMax' => Carbon::today()->addMonth()->toRfc3339String()
        ]);
    }
}