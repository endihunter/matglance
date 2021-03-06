<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, Mandrill, and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'mandrill' => [
        'secret' => env('MANDRILL_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID', '898499996547-4n2kjg6oeiv2mlk2cigi5bos3sshmm0m.apps.googleusercontent.com'),
        'client_secret' => env('GOOGLE_CLIEND_SECRET', 'LiTJf9RACPJ-DdiUr2hrEbZX'),
        'redirect' => config('app.url') . '/auth/google/callback',
        'scopes' => [
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/gmail.modify',
        ],
    ],

    'geocode' => [
        'api_key' => env('GEOCODE_KEY', 'AIzaSyD3qcJmYvBZWMCm_HWyu4q_dvl8ARcShXc'),
    ],

    'ipinfodb' => [
        'api_key' => env('IPINFODB_KEY', 'd5535a670af73a930430928c68ee65ac5fcb6f07b8e1f7149c639840011831ab'),
    ],

    'places' => [
        'api_key' => env('PLACES_KEY', 'AIzaSyBK2OkpLluTlXQtnRZaxv5IHGaEDd-95HM'),
    ],

    'forecast' => [
        'api_key' => env('FORECAST_KEY', '29245780e15e42e8b48f2f358f898afe'),
    ],
];
