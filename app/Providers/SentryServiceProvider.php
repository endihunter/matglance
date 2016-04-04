<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Monolog\Formatter\LineFormatter;
use Monolog\Handler\RavenHandler;
use Raven_Client;
use Request;

class SentryServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        return;

        $this->app->configureMonologUsing(function ($monolog) {
            $client = new Raven_Client('https://822c516798774948a7378813fcd1b518:cc423b12b2004cedb702941ff71d753c@app.getsentry.com/2');

            $handler = new RavenHandler($client);
            $handler->setFormatter(new LineFormatter("%message% %context% %extra%\n"));

            $monolog->pushHandler($handler);

            $monolog->pushProcessor(function ($record) {
                // Add the authenticated user
                if ($user = Auth::user()) {
                    $record['context']['user'] = [
                        'username' => $user->username,
                        'ip_address' => Request::getClientIp(),
                    ];
                } else {
                    $record['context']['user'] = [
                        'ip_address' => Request::getClientIp(),
                    ];
                }

                // Add various tags
                //$record['context']['tags'] = ['key' => 'value'];

                // Add various generic context
                //$record['extra']['key'] = 'value';

                return $record;
            });

            return $monolog;
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
