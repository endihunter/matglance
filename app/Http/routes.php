<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

use App\Repositories\GMailRepository;

Route::group(['middleware' => ['web']], function () {
    Route::get('/', [
        'as' => 'dashboard',
        'middleware' => 'auth',
        'uses' => 'DashboardController@index',
    ]);

    Route::get('/login', function () {
        return view('login');
    });

    Route::get('logout', 'GoogleController@logout');

    Route::group([
        'middleware' => 'guest',
        'prefix' => 'auth/google',
    ], function () {
        Route::get('/', [
            'as' => 'google.request-token',
            'uses' => 'GoogleController@requestToken',
        ]);

        Route::get('callback', [
            'as' => 'google.request-user',
            'uses' => 'GoogleController@requestUser',
        ]);
    });

    Route::group([
        'prefix' => 'api/v1',
    ], function () {
        Route::get('quotes/random', [
            'as' => 'api.quotes.random',
            'uses' => 'Api\QuotesController@random',
        ]);

        Route::group(['prefix' => 'gmail'], function () {
            Route::get('labels', [
                'as' => 'api.gmail.labels',
                'uses' => 'Api\GmailController@labels',
            ]);

            Route::get('messages', [
                'as' => 'api.gmail.messages',
                'uses' => 'Api\GmailController@lists',
            ]);

            Route::get('messages/{id}', [
                'as' => 'api.gmail.message',
                'uses' => 'Api\GmailController@get',
            ]);

            Route::get('messages/{id}/touch', [
                'as' => 'api.gmail.message.touch',
                'uses' => 'Api\GmailController@touch',
            ]);
        });

        Route::get('weather/get', [
            'as' => 'api.weather.proxy',
            'uses' => 'Api\WeatherController@get',
        ]);

        Route::group(['prefix' => 'geo'], function () {
            Route::get('code', [
                'as' => 'api.geo.code',
                'uses' => 'Api\GeoController@code'
            ]);

            Route::get('lookup', [
                'as' => 'api.geo.lookup',
                'uses' => 'Api\GeoController@lookup'
            ]);
        });
    });

    Route::get('/gmail/messages/{id}/body', [
        'middleware' => 'auth',
        'as' => 'gmail.body',
        'uses' => function ($messageId, GMailRepository $repo) {
            $me = auth()->user();

            $body = $repo->get($me->email, $messageId)->body();

            return view('iframe', [
                'body' => array_get($body, 'html', array_get($body, 'plain')),
            ]);
        },
    ]);

    Route::get('/gmail/messages/{message_id}/attachment/{attachment_id}', [
        'middleware' => 'auth',
        'as' => 'gmail.attachment',
        'uses' => function ($messageId, $attachmentId, GMailRepository $repo) {
            $me = auth()->user();

            $data = $repo->fetchAttachment($me->email, $messageId, $attachmentId);

            return response(\App\Base64::decode($data), 200);
        },
    ]);
});
