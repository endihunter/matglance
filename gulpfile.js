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

elixir(function (mix) {
    mix.sass('helpers.scss');

    /* ========= THEMES START =========== */
    mix.less([
        'light/core.less',
        'light/components.less',
        'light/pages.less',
        'light/menu.less',
        'light/responsive.less'
    ], 'public/css/admin_light.css');

    mix.less([
        'shadow/core.less',
        'shadow/components.less',
        'shadow/pages.less',
        'shadow/menu.less',
        'shadow/responsive.less'
    ], 'public/css/admin_shadow.css');

    mix.less([
        'light/core.less',
        'light/components.less',
        'light/pages.less',
        'light/menu_dark.less',
        'light/responsive.less'
    ], 'public/css/admin_dark_menu.css');

    mix.version([
        'css/admin_light.css',
        'css/admin_shadow.css',
        'css/admin_dark_menu.css'
    ]);
    /* ========= THEMES END =========== */


    /* ========= SCRIPTS START =========== */
    mix.scripts([
        'node_modules/angular/angular.js',
        'node_modules/angular-sanitize/angular-sanitize.js',
        'node_modules/angular-local-storage/dist/angular-local-storage.js',
        'node_modules/underscore/underscore.js',
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
        'js/app.js',
        'js/vendor.js'
    ]);
    /* ========= SCRIPTS END =========== */
});
