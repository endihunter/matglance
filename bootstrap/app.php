<?php

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| The first thing we will do is create a new Laravel application instance
| which serves as the "glue" for all the components of Laravel, and is
| the IoC container for the system binding all of the various parts.
|
*/

use Monolog\Formatter\LineFormatter;
use Monolog\Handler\RavenHandler;

$app = new Illuminate\Foundation\Application(
    realpath(__DIR__.'/../')
);

/*
|--------------------------------------------------------------------------
| Bind Important Interfaces
|--------------------------------------------------------------------------
|
| Next, we need to bind some important interfaces into the container so
| we will be able to resolve them when needed. The kernels serve the
| incoming requests to this application from both the web and CLI.
|
*/

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

$app->configureMonologUsing(function ($monolog) {
    $client = new Raven_Client('http://822c516798774948a7378813fcd1b518:cc423b12b2004cedb702941ff71d753c@sentry.myterranet.com/2');

    $handler = new RavenHandler($client);
    $handler->setFormatter(new LineFormatter("%message% %context% %extra%\n"));

    $monolog->pushHandler($handler);

    $monolog->pushProcessor(function ($record) {
        // Add the authenticated user
        if ($user = Auth::user()) {
            $record['context']['user'] = array_merge($user->toArray(), [
                'ip_address' => Request::getClientIp(),
            ]);
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

/*
|--------------------------------------------------------------------------
| Return The Application
|--------------------------------------------------------------------------
|
| This script returns the application instance. The instance is given to
| the calling script so we can separate the building of the instances
| from the actual running of the application and sending responses.
|
*/

return $app;
