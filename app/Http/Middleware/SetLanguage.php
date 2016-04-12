<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Config;

class SetLanguage
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (auth()->check()) {
            $me = auth()->user();
            $lang = $me->lang()->iso6391;

            if ($lang !== config('app.locale')) {
                Config::set('app.locale', $lang);
                Carbon::setLocale(config('app.locale'));
            }
        }

        return $next($request);
    }
}
