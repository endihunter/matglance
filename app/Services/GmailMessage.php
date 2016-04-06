<?php

namespace App\Services;

use Carbon\Carbon;
use Google_Service_Gmail_Message;

class GmailMessage
{
    const BODY_PLAIN = 'plain';

    const BODY_HTML = 'html';

    /**
     * @var Google_Service_Gmail_Message
     */
    protected $message;

    protected $headers = [];

    public function __construct(Google_Service_Gmail_Message $message)
    {
        $this->message = $message;
    }

    /**
     * Retrieve header value.
     *
     * @param null $key
     * @return mixed
     * @throws \Exception
     */
    public function header($key = null)
    {
        $headers = $this->fetchHeaders();

        if (null === $key) {
            return $headers;
        }

        if (!array_has($this->headers, $key)) {
            throw new \Exception('No value found for header: ' . $key);
        }

        return $this->headers[$key];
    }

    public function from()
    {
        $from = $this->header('From');

        preg_match('~^([^\<]+)\s+\<([^\>]+)\>$~si', $from, $matches);

        $matches = array_slice($matches, 1);

        $matches = array_map(function ($item) {
            return trim($item, '"\'');
        }, $matches);

        return array_reverse($matches);
    }

    /**
     * Fetch the message body.
     *
     * @param string $type
     * @return mixed
     */
    public function body($type = self::BODY_PLAIN)
    {
        $parts = $this->message->getPayload()->getParts();

        if (empty($parts)) {
            $body = $this->message->getPayload()->getBody()->getData();
        } else {
            $key = (int) (static::BODY_HTML == $type);

            $body = $parts[$key]->getBody();
            $body = $body->getData();
        }

        $body = strtr($body, '-_', '+/');

        $body = base64_decode($body);

        return $body;
    }

    /**
     * Get the message sent time.
     *
     * @return string
     */
    public function relativeTime()
    {
        return Carbon::createFromTimestamp(
            $this->message->getInternalDate() / 1000
        )->diffForHumans();
    }

    public function explore()
    {
        return get_class_methods($this->message);
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
     * Fetch all headers
     *
     * @return mixed
     */
    protected function fetchHeaders()
    {
        if (empty ($this->headers)) {
            foreach ($this->message->getPayload()->getHeaders() as $header) {
                $this->headers[$header->getName()] = $header->getValue();
            }
        }

        return $this->headers;
    }
}
