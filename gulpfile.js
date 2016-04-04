var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.scripts([
        'angular/angular.min.js',
        'angular-local-storage/dist/angular-local-storage.min.js'
    ], 'public/js/vendor.js', 'node_modules');

    mix.scripts([
        'helpers.js',
        'app.js',
        'controllers/*.js',
        'directives/*.js',
        'services/*.js'
    ], 'public/js/app.js', 'resources/assets/javascript');

    mix.version([
        'js/app.js'
    ])
});
