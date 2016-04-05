<?php

namespace App\Transformers;

use App\Services\GmailMessage;
use League\Fractal\TransformerAbstract;

class GmailMessageTransformer extends TransformerAbstract
{
    public function transform(GmailMessage $message)
    {
        return [
            'id' => $message->getId(),
            'snippet' => $message->getSnippet(),
            'subject' => $message->header('Subject'),
            'from' => $message->from(),
            'labels' => $message->getLabelIds(),
            'date' => $message->relativeTime()
        ];
    }
}