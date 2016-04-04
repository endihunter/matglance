<?php

namespace App\Providers;

use Google_Service_Calendar;
use Google_Service_Gmail;
use Illuminate\Support\ServiceProvider;

class GoogleApiServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->bind('google.client', function () {
            $client = new \Google_Client;

            $client->setScopes(config('services.google.scopes'));
            $client->setApplicationName(config('app.url'));
            $client->setAuthConfigFile(resource_path('client_secret.json'));

            $client->setAccessType('offline');
            //$client->setApprovalPrompt('force');

            if ($user = auth()->check()) {
                $user = auth()->user();
                $token = $user->token;

                $client->setAccessToken(json_encode($token));
                
                // Refresh the token if it's expired.
                if ($client->isAccessTokenExpired()) {
                    $client->refreshToken(
                        $refreshToken = $client->getRefreshToken()
                    );

                    $user->refreshToken($refreshToken);
                }
            }

            return $client;
        });

        $this->app->bind('google.calendar', function ($app) {
            return $calendar = new Google_Service_Calendar(
                $app['google.client']
            );
        });

        $this->app->bind('google.mail', function ($app) {
            return new Google_Service_Gmail(
                $app['google.client']
            );
        });
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
