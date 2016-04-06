app.controller('WeatherController', [
    '$scope', '$timeout', 'WeatherService', 'GeoService', 'localStorageService', '$rootScope',
    function ($scope, $timeout, WeatherService, GeoService, localStorageService, $rootScope) {
        $scope.filter = {
            units: 'si'
        };

        $scope.weather = {};

        var weather;
        if (weather = localStorageService.get('weather')) {
            $scope.weather = JSON.parse(weather);
        }

        WeatherService.when('location.changed', function () {
            WeatherService.get().then(function (results) {
                localStorageService.set('weather', JSON.stringify(results));

                $scope.weather = results;
            });
        });

        var location;
        if (!(location = localStorageService.get('geolocation'))) {
            GeoService.locate().then(function (GeoService) {
                localStorageService.set('geolocation', [
                    GeoService.getLatitude(),
                    GeoService.getLongitude()
                ].join(","));

                $scope.$emit('location.changed');
            });
        } else {
            var coords = location.split(',');
            GeoService.setLocation(coords[0], coords[1]);
            $scope.$emit('location.changed');
        }

        /**
         * Save module preferences
         * @returns {boolean}
         */
        $scope.savePreferences = function () {
            WeatherService.setUnits($scope.filter.units);

            $scope.$emit('location.changed');

            return false;
        };

        $scope.timezoneToCity = function (timezone) {
            return timezone.split('/').join("<br />");
        }
    }]);