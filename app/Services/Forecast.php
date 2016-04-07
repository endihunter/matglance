<?php

namespace App\Services;

use Carbon\Carbon;

class Forecast
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.forecast.api_key');
    }

    public function get($coords, $units)
    {
        $url = "https://api.forecast.io/forecast/{$this->apiKey}/{$coords}/?" .
            http_build_query([
                'units' => $units,
                'exclude' => join(",", ['minutely', 'hourly', 'daily', 'flags', 'alerts']),
                'lang' => config('app.lang'),
            ]);

        $data = json_decode(file_get_contents($url), true);

        return $this->cast($data);
    }

    protected function cast($data)
    {
        foreach ($data as $key => &$value) {
            if (is_numeric($value) && 'phone' !== $key) {
                $value = (double) $value;

                if (in_array($key, ['cloudCover', 'humidity', 'precipProbability'])) {
                    $value *= 100;
                }

                if ('time' == $key) {
                    $value = Carbon::createFromTimestamp($value)->toFormattedDateString();
                }
            } else if (is_array($value)) {
                $value = $this->cast($value);
            }
        }

        return $data;
    }
}