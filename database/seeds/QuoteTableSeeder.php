<?php

use App\Quote;
use Illuminate\Database\Seeder;

class QuoteTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('quotes')->truncate();

        $page = 1;
        $pages = 3;

        $client = new Guzzle\Http\Client();
        $client->setBaseUrl('http://www.goodreads.com/quotes/tag');

        $total = 0;
        while ($page++ <= $pages) {
            //$body = $client->get('life?page=' . $page)->send()->getBody(true);
            $body = file_get_contents($client->getBaseUrl() . '/life?page=' . $page);

            $crawler = new Symfony\Component\DomCrawler\Crawler();
            $crawler->addHtmlContent($body);

            $quotes = $crawler->filter('.leftContainer div.quoteText');

            $quotes->each(function ($node) use (&$total) {
                $parts = array_filter(explode(PHP_EOL, trim(strip_tags($node->text()))), function (&$value) {
                    $value = trim($value);

                    if (empty($value) || '―' == $value)
                        return false;

                    return $value;
                });
                $parts = array_map('trim', $parts);

                $quote = array_shift($parts);
                $author = array_shift($parts);

                Quote::create([
                    'language' => ($lang = rand(0, 1) ? 'en' : 'de'),
                    'quote' => $lang . ': ' . trim($quote),
                    'author' => trim($author, '., '),
                ]);

                $total++;
            });
        }

        printf("%d quotes were imported.", $total);
    }
}
