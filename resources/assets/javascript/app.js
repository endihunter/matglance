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

if (location.host == 'dev-your-morning.rainbowriders.dk') {
    app.API_PREFIX =  '/public/api/v1';
    app.ASSETS_PATH = '/public/assets/templates/';
} else {
    app.API_PREFIX =  '/api/v1';
    app.ASSETS_PATH = '/assets/templates/';
}
console.log('api', app.API_PREFIX);
