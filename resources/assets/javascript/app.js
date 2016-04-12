var app = angular.module('app', ['ngSanitize', 'LocalStorageModule']);

app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ymag');
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

app.API_PREFIX = '/api/v1';
