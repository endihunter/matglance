<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\User;
use Google_Auth_OAuth2;
use Google_Service_Plus;
use Illuminate\Cookie\CookieJar;
use Illuminate\Http\Request;

class GoogleController extends Controller
{
    public function requestToken()
    {
        $client = app('google.client');

        $auth = new Google_Auth_OAuth2($client);

        $url = $auth->createAuthUrl(
            implode(' ', config('services.google.scopes'))
        );

        return redirect()->to($url);
    }

    public function requestUser(Request $request, CookieJar $cookieJar)
    {
        try {
            $client = app('google.client');

            $client->authenticate(
                $request->get('code')
            );

            $plus = new Google_Service_Plus($client);

            auth()->login(
                User::fromGPlusUser($me = $plus->people->get('me'), $client->getAccessToken())
            );

            $cookieJar->queue(
                cookie('ymag_name', (string) $me->getDisplayName())
            );

            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            return back()->withErrors(['request-user' => $e->getMessage()]);
        }
    }

    public function logout()
    {
        app('auth')->logout();

        return redirect('/');
    }
}
