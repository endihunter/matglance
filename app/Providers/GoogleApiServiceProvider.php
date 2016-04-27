<?php

namespace App\Providers;

use Google_Service_Calendar;
use Google_Service_Gmail;
use Illuminate\Support\ServiceProvider;

class GoogleApiServiceProvider extends ServiceProvider
{
    protected function initClient()
    {
        $client = new \Google_Client;

        $client->setScopes(config('services.google.scopes'));
        $client->setApplicationName(config('app.url'));
        $client->setAuthConfigFile(resource_path('client_secret.json'));

        $client->setAccessType('offline');

        return $client;
    }

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->bind('google.client', function () {
            $client = $this->initClient();

            // @todo: Remove this statement on production
            //$client->setApprovalPrompt('force');
            if (env('FORCE_ACCOUNT_CHOOSER', true)) {
                $client->setPrompt('select_account');
            }

            $auth = auth();
            if ($auth->check()) {
                $client = $this->handleRefreshToken($auth, $client);
            }

            return $client;
        });

        $this->app->bind('google.client.api', function () {
            $client = $this->initClient();

            $auth = auth('api');

            if ($auth->check()) {
                $client = $this->handleRefreshToken($auth, $client);
            }

            return $client;
        });

        $this->app->bind('google.calendar', function ($app) {
            return $calendar = new Google_Service_Calendar(
                $app['google.client']
            );
        });

        $this->app->bind('google.calendar.api', function ($app) {
            return $calendar = new Google_Service_Calendar(
                $app['google.client.api']
            );
        });

        $this->app->bind('google.mail', function ($app) {
            return new Google_Service_Gmail(
                $app['google.client']
            );
        });

        $this->app->bind('google.mail.api', function ($app) {
            return new Google_Service_Gmail(
                $app['google.client.api']
            );
        });
    }

    /**
     * @param $auth
     * @param $client
     */
    protected function handleRefreshToken($auth, $client)
    {
        $user = $auth->user();
        $token = $user->token;

        $client->setAccessToken(json_encode($token));

        // Refresh the token if it's expired.
        if ($client->isAccessTokenExpired()) {
            $client->refreshToken(
                $refreshToken = $client->getRefreshToken()
            );

            $user->refreshToken($refreshToken);
        }

        return $client;
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
