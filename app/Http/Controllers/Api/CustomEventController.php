<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Auth;
use Carbon\Carbon;
use App\CustomEvent;
use Validator;

class CustomEventController extends Controller
{
    public function getCustomEvent(Request $request) {

        $me = Auth::guard('api')->user();
        $event = CustomEvent::where('user_id', $me->id)
                            ->whereDate('time', '>=', Carbon::today()->toDateString())
                            ->first();

        if($event) {
            return response()->json([
                'data' => $event,
            ]);
        }
        return response()->json([
            'data' => 'No Event created yet',
        ]);
    }

    public function postCustomEvent(Request $request) {
        $me = Auth::guard('api')->user();

        $date = $request->get('date');
        $title = $request->get('title');
        $time_option = $request->get('time_option');

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'date' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'data' => [
                    'error' => $validator->errors()->all(),
                ]
            ]);
        }

        $eventDate = Carbon::createFromFormat('d/m/Y', $date);

        $eventDate->hour = $this->setEventTime($request->get('hours'));
        $eventDate->minute = $this->setEventTime($request->get('minutes'));
        $eventDate->second = $this->setEventTime($request->get('seconds'));

        if(CustomEvent::whereDate('time', '>=', Carbon::today()->toDateString())->first()) {
            return response()->json([
                'data' => [
                    'error' => 'You can set only one active event',
                ]
            ]);
        }

        $event = CustomEvent::create([
            'title'       => $title,
            'time_option' => $time_option,
            'time'        => $eventDate,
            'user_id'     => $me->id,

        ]);


        return response()->json([
            'data' => $event,
        ]);
    }

    private function setEventTime($val) {
        if($val != null) {
            return $val;
        }
        return 0;
    }
}
