<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomEvent extends Model
{
    protected $table = 'custom_events';

    protected $fillable = ['user_id', 'title', 'time_option', 'time'];

    protected $hidden = ['created_at', 'updated_at'];
}
