<?php

namespace App\Services;

use Carbon\Carbon;
use Google_Service_Calendar;

class Calendar
{
    protected $userId;

    /**
     * @var Google_Service_Calendar
     */
    protected $client;

    public function __construct($userId)
    {
        $this->userId = $userId;
        $this->client = app('google.calendar');
    }

    static public function of($email)
    {
        return new static($email);
    }

    public function listCalendars()
    {
        return $this->client->calendarList->listCalendarList();
    }

    public function events($calendarId)
    {
        return $this->client->events->listEvents($calendarId, [
            'showDeleted' => false,
            'singleEvents' => true,
            'timeMin' => Carbon::today()->toRfc3339String(),
            //'timeMax' => Carbon::today()->addDays(7)->toRfc3339String()
            'timeMax' => Carbon::today()->addMonth()->toRfc3339String()
        ]);
    }
}