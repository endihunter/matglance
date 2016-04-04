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
        'name', 'email', 'password', 'token', 'google_id', 'avatar',
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
        'token' => 'json'
    ];

    public function scopeGPlusMember($query, $id)
    {
        return $query->where('google_id', $id);
    }

    static public function fromGPlusUser(Google_Service_Plus_Person $gPlusUser, $token = null)
    {
        if (! $user = static::GPlusMember($gPlusUser->getId())->first()) {
            $user = static::create([
                'google_id' => $gPlusUser->getId(),
                'name' => $gPlusUser->getDisplayName(),
                'email' => $gPlusUser->getEmails()[0]->getValue(),
                'avatar' => $gPlusUser->getImage()->getUrl(),
                'token' => json_decode($token, true),
            ]);
        }

        return $user;
    }

    public function refreshToken($token)
    {
        $this->token = array_merge($this->token, [
            'refresh_token' => $token
        ]);
        $this->save();

        return $this;
    }
}
