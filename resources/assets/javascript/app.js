var app = angular.module('app', ['ngSanitize', 'LocalStorageModule']);

app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ymag_');
    localStorageServiceProvider.setStorageCookie(1, '/');
}]);

app.run(['$rootScope', function ($rootScope) {
    
}]);

app.API_PREFIX = '/api/v1';
