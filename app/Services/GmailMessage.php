<?php

namespace App\Services;

use Google_Service_Gmail_Message;

class GmailMessage
{
    /**
     * @var Google_Service_Gmail_Message
     */
    protected $message;

    protected $headers = [];

    public function __construct(Google_Service_Gmail_Message $message)
    {
        $this->message = $message;
    }

    public function header($key = null)
    {
        $headers = $this->fetchHeaders();

        if (null === $key) {
            return $headers;
        }

        if (! array_has($this->headers, $key)) {
            throw new \Exception('No value found for header: ' . $key);
        }

        return $this->headers[$key];
    }

    public function body($type = 'plain')
    {
        $parts = $this->message->getPayload()->getParts();

        if (empty($parts)) {
            $body = $this->message->getPayload()->getBody()->getData();
        } else {
            $key = (int) ('html' == $type);

            $body = $parts[$key]->getBody();
            $body = $body->getData();
        }

        $body = strtr($body, '-_', '+/');

        return base64_decode($body);
    }

    public function __call($method, $args)
    {
        return call_user_func_array([$this->message, $method], $args);
    }

    public function __get($name)
    {
        return $this->message->$name;
    }

    /**
     * @return mixed
     */
    protected function fetchHeaders()
    {
        if (empty ($this->headers)) {
            foreach($this->message->getPayload()->getHeaders() as $header) {
                $this->headers[$header->getName()] = $header->getValue();
            }
        }

        return $this->headers;
    }
}
