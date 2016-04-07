app.factory("WeatherService", ['$http', '$httpParamSerializer',
    function ($http, $httpParamSerializer) {
        var factory = {};

        factory.get = function (coords, params) {
            var args = angular.extend({
                coords: coords,
                units: 'si'
            }, params || {});

            return $http
                .get(app.API_PREFIX + '/weather/get/?' + $httpParamSerializer(args))
                .then(function (response) {
                    return response.data;
                });
        };

        return factory;
    }]);