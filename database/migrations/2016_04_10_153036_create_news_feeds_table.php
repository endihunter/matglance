<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewsFeedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('news_feeds', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('lang_id');
            $table->string('name', 100)->index();
            $table->string('url', 255)->unique();
            $table->string('categories')->nullable();
            $table->timestamps();

            $table->foreign('lang_id')->references('id')->on('languages')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('news_feeds');
    }
}
