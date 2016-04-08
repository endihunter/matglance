<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class GeoController extends Controller
{
    /**
     * Convert address to coordinates
     *
     * @param Request $request
     * @return mixed
     */
    public function code(Request $request)
    {
        $url = $this->getGeoUrl([
            'address' => $request->get('loc', 'New York, USA'),
            'components' => 'locality|country|administrative_area',
        ]);

        return $this->buildResponse($url);
    }

    /**
     * Convert coordinates to address
     *
     * @param Request $request
     * @return mixed
     */
    public function lookup(Request $request)
    {
        $url = $this->getGeoUrl([
            'latlng' => $request->get('latlng'),
            'result_type' => 'country|locality',
        ]);

        return $this->buildResponse($url);
    }

    /**
     * Suggest places that matches query.
     *
     * @param Request $request
     * @return mixed
     */
    public function places(Request $request)
    {
        $url = $this->getPlacesUrl([
            'input' => $request->get('name')
        ]);

        return $this->buildResponse($url);
    }

    /**
     * @param array $params
     * @return string
     */
    protected function getGeoUrl(array $params = [])
    {
        $me = auth()->user();

        $url = 'https://maps.googleapis.com/maps/api/geocode/json?' .
            http_build_query(array_merge([
                'key' => config('services.geocode.api_key'),
                'language' => $me->lang()->iso6391,
            ], $params));

        return $url;
    }

    protected function getPlacesUrl(array $params = [])
    {
        $me = auth()->user();

        return 'https://maps.googleapis.com/maps/api/place/autocomplete/json?' .
            http_build_query(array_merge([
                'key' => config('services.places.api_key'),
                'types' => '(cities)',
                'language' => $me->lang()->iso6391,
            ], $params));
    }

    /**
     * @param $url
     * @return mixed
     */
    protected function buildResponse($url)
    {
        return response(file_get_contents($url), 200)
            ->header('Content-Type', 'json');
    }


}
