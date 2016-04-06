app.factory("WeatherService", ['$http', '$rootScope', 'GeoService', '$httpParamSerializer',
    function ($http, $rootScope, GeoService, $httpParamSerializer) {
        var factory = {
            units: 'si'
        };

        factory.setUnits = function (units) {
            factory.units = units;

            return factory;
        };

        /**
         * Listen for an event.
         *
         * @param event
         * @param callback
         */
        factory.when = function (event, callback) {
            $rootScope.$on(event, callback);

            return factory;
        };

        factory.get = function () {
            var coords = [
                GeoService.getLatitude(),
                GeoService.getLongitude()
            ].join(",");

            var args = {
                coords: coords,
                units: factory.units
            };

            return $http
                .get(app.API_PREFIX + '/weather/get/?' + $httpParamSerializer(args))
                .then(function (response) {
                    return response.data;
                });
        };

        return factory;
    }]);