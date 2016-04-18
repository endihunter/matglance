app.factory("WeatherService", ['$http', '$httpParamSerializer', function ($http, $httpParamSerializer) {
    var factory = {};

    factory.fetch = function (coords, params) {
        var $args = angular.extend({
            coords: coords,
            units: 'si'
        }, params || {});

        var $url = app.API_PREFIX + '/weather/get?' + $httpParamSerializer($args);
        console.log('weather url', $url);
        return $http
            .get($url)
            .then(function (response) {
                console.log('got weather response');
                return response.data;
            }).catch(function (e) {
                console.error('error', e);
            });
    };

    return factory;
}]);