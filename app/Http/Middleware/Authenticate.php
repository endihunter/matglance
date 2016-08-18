<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Google_Client;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->guest()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response('Unauthorized.', 401);
            } else {
                return redirect()->guest('login');
            }
        }

        $me = auth()->user();

        if(!$me) {
            $me = Auth::guard('api')->user();
        }
        $token = $me->token;

        $client = new Google_Client;
        $client->setAccessToken(json_encode($token));
        // Refresh the token if it's expired.
        if ($client->isAccessTokenExpired()) {
            $client->refreshToken(
                $refreshToken = $client->getRefreshToken()
            );

            $me->refreshToken($refreshToken);
        }

        return $next($request);
    }
}
