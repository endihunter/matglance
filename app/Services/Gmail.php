<?php

namespace App\Services;

use Google_Service_Gmail_Message;

class Gmail
{
    protected $email;

    protected $take = 5;

    protected $pageToken = null;

    protected $includeSpamTrash;

    protected $query;

    protected $client;

    public function __construct($email)
    {
        $this->email = $email;

        $this->client = app('google.mail');
    }

    static public function of($email)
    {
        return new static($email);
    }

    public function take($take)
    {
        $this->take = (int) $take;

        return $this;
    }

    public function withSpamTrash($flag = false)
    {
        $this->includeSpamTrash = (bool) $flag;

        return $this;
    }

    /**
     * Search for messages
     *
     * @param string $query
     * @return $this
     */
    public function filter($query)
    {
        $this->query = $query;

        return $this;
    }

    public function messages()
    {
        $messages = $this->client->users_messages->listUsersMessages($this->email, [
            'maxResults' => $this->take,
            'pageToken' => $this->pageToken,
            'includeSpamTrash' => $this->includeSpamTrash,
            'q' => $this->query,
        ]);

        if ($nextPageToken = $messages->getNextPageToken()) {
            $this->pageToken = $nextPageToken;    
        }        

        return array_map(function (Google_Service_Gmail_Message $message) {
            return $this->get($message->getId());
        }, $messages->getMessages());
    }

    /**
     * @return Google_Service_Gmail_Message
     */
    public function get($id)
    {
        $message = $this->client->users_messages->get(
            $this->email, $id
        );

        return new GmailMessage($message);
    }
}
