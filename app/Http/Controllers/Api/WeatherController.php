<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class WeatherController extends Controller
{
    public function get(Request $request)
    {
        $apiKey = config('services.forecast.api_key');
        $coords = $request->get('coords');

        $url = "https://api.forecast.io/forecast/{$apiKey}/{$coords}/?" .
            http_build_query($request->only(['units']));

        $data = json_decode(file_get_contents($url), true);

        $data = $this->cast($data);

        return response($data, 200)
            ->header('Content-Type', 'json');
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
