<?php

namespace App\Http\Controllers\Api;

use App\Services\Gmail;
use App\Transformers\GmailLabelTransformer;
use App\Transformers\GmailMessageTransformer;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Restable;

class GmailController extends Controller
{
    public function labels()
    {
        $me = auth()->user();

        $gmail = Gmail::of($me->email);

        $labels = $gmail->labels();

        return Restable::listing($labels, new GmailLabelTransformer);
    }

    public function messages(Request $request)
    {
        $me = auth()->user();

        $gmail = Gmail::of($me->email);

        $messages = $gmail
            ->labeledAs($request->get('labelIds', []))
            ->match($request->get('q', null))
            ->withSpamTrash((bool) $request->get('includeSpamTrash', false))
            ->take((int) $request->get('maxResults', 5))
            ->messages();

        return Restable::listing($messages, new GmailMessageTransformer);
    }
}
