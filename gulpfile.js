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
    mix.sass('helpers.scss');
    
    mix.scripts([
        'node_modules/angular/angular.min.js',
        'node_modules/angular-sanitize/angular-sanitize.min.js',
        'node_modules/angular-local-storage/dist/angular-local-storage.min.js',
        'node_modules/underscore/underscore-min.js',
        'bower_components/skycons/skycons.js',
    ], 'public/js/vendor.js', './');

    mix.scripts([
        'helpers.js',
        'app.js',
        'controllers/*.js',
        'directives/*.js',
        'services/*.js'
    ], 'public/js/app.js', 'resources/assets/javascript');

    mix.version([
        'css/helpers.css',
        'js/app.js'
    ])
});
