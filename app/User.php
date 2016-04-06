<?php

namespace App;

use Google_Service_Plus_Person;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'url', 'password', 'token', 'google_id', 'avatar',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'token' => 'array',
    ];

    /**
     * Fetch the user by Google+ ID
     *
     * @param $query
     * @param $id
     * @return mixed
     */
    public function scopeGPlusMember($query, $id)
    {
        return $query->where('google_id', $id);
    }

    /**
     * Create new member based on Google+ [/me] info
     *
     * @param Google_Service_Plus_Person $gPlusUser
     * @param null $token
     * @return static
     */
    static public function fromGPlusUser(Google_Service_Plus_Person $gPlusUser, $token = null)
    {
        if (!$user = static::GPlusMember($gPlusUser->getId())->first()) {
            $user = static::create([
                'google_id' => $gPlusUser->getId(),
                'name' => $gPlusUser->getDisplayName(),
                'email' => $gPlusUser->getEmails()[0]->getValue(),
                'url' => $gPlusUser->getUrl() ?: null,
                'avatar' => $gPlusUser->getImage()->getUrl(),
                'token' => json_decode($token, true),
            ]);
        }

        if (! is_null($token)) {
            $userToken = (array) $user->token;
            $token = (array) json_decode($token, true);

            if (! empty($diff = array_diff($userToken, $token))) {
                $user->token = array_merge($userToken, $diff);

                $user->save();
            }
        }

        return $user;
    }

    /**
     * Refresh `refresh_token` required for Server-Server calls
     *
     * @param $refreshToken
     * @return $this
     */
    public function refreshToken($refreshToken)
    {
        $this->token = array_merge((array) $this->token, [
            'refresh_token' => $refreshToken,
        ]);
        $this->save();

        return $this;
    }
}
