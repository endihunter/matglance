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
        'prefix' => 'api/v1'
    ], function () {
        Route::get('quotes/random', [
            'as' => 'api.quotes.random',
            'uses' => 'Api\QuotesController@random'
        ]);

        Route::get('gmail/labels', [
            'as' => 'api.gmail.labels',
            'uses' => 'Api\GmailController@labels'
        ]);

        Route::get('gmail/messages', [
            'as' => 'api.gmail.messages',
            'uses' => 'Api\GmailController@lists'
        ]);

        Route::get('gmail/messages/{id}', [
            'as' => 'api.gmail.message',
            'uses' => 'Api\GmailController@get'
        ]);

        Route::get('gmail/messages/{id}/touch', [
            'as' => 'api.gmail.message.touch',
            'uses' => 'Api\GmailController@touch'
        ]);
    });

    Route::get('/gmail/messages/{id}/body', [
        'middleware' => 'auth',
        'uses' => function ($messageId, GMailRepository $repo) {
            $me = auth()->user();

            return view('iframe', [
                'body' => $repo->get($me->email, $messageId)->body(\App\Services\GmailMessage::BODY_HTML)
            ]);
        }
    ]);

    Route::get('/test', function () {
        $client = app('google.client');

        $calendar = app('google.calendars');

        dd($calendar->calendarList->get('endi1982@gmail.com'));
        dd($events = $calendar->events->listEvents('endi1982@gmail.com'));


        $gmail = \App\Services\Gmail::of('endi1982@gmail.com')->take(10)->withSpamTrash(false);

        $messages = array_map(function($message) {
            return [
                'id' => $message->getId(),
                'subject' => $message->header('Subject'),
                'body' => $message->body()
            ];
        }, $gmail->messages());

        dd($messages);

        return $client;
    });

});
