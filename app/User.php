<?php

namespace App;

use Google_Service_Plus_Person;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Terranet\Localizer\Models\Language;

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

            foreach ($userToken as $key => $value) {
                if (array_has($token, $key) && $token[$key] !== $value) {
                    $userToken[$key] = $token[$key];
                }
            }

            $user->fill([
                'token' => $userToken
            ])->save();
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

    /**
     * Retrieve user's preffered language.
     *
     * @return mixed
     */
    public function lang()
    {
        $langId = $this->language_id;
            
        return Language::find($langId) ? : Language::where('is_default', 1)->first();
    }

    /**
     * Preferences relationship
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function preferences()
    {
        return $this->hasOne(Preference::class);
    }
}
