<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class PatentCollector extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'patent:src';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Build patent file from source code';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $fs = new Filesystem();
        $files = $fs->allFiles($src = '/Users/endi/Desktop/unica_nutrition_src');

        $output = $src . '/output.txt';

        foreach ($files as $file) {
            $filename = $file->getRelativePathname();
            $contents = trim($file->getContents());
            $delimiter = str_repeat("=", 60);

            $data = <<<OUT
{$filename}
{$delimiter}
{$contents}
{$delimiter}



OUT;
            $fs->append($output, $data);
        }

        $this->comment("Done!");
    }
}
