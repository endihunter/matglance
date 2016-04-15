<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\User;
use Google_Auth_OAuth2;
use Google_Service_Plus;
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

    public function requestUser(Request $request)
    {
        try {
            $client = app('google.client');

            $client->authenticate(
                $request->get('code')
            );
            $plus = new Google_Service_Plus($client);

            auth()->login(
                User::fromGPlusUser($me = $plus->people->get('me'), $client->getAccessToken()),
                true
            );

            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([trans('auth.unable_to_fetch')]);
        }
    }

    public function logout()
    {
        app('auth')->logout();

        return redirect('/');
    }
}
