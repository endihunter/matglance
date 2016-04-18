var app = angular.module('app', ['ngSanitize', 'LocalStorageModule']);

app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ymag.' + window['lang']);
    localStorageServiceProvider.setStorageCookie(1, '/');
}]);

app.run(['$rootScope', function ($rootScope) {
    window.onclick = function (event) {
        if (0 == $(event.target).closest('div.card-actions.dropdown.open').length
            && 0 == $(event.target).closest('#cities-list').length) {
            $rootScope.$broadcast('cardbox.close');
        }
    };
}]);

app.REWRITE_BASE = '/';
if (location.host == 'dev-your-morning.rainbowriders.dk') {
    app.REWRITE_BASE = '/public/';
}

app.API_PREFIX = app.REWRITE_BASE + 'api/v1';
