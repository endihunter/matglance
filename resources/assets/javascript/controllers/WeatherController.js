app.controller('WeatherController', [
    '$scope', '$timeout', 'WeatherService', 'GeoService', 'localStorageService',
    function ($scope, $timeout, WeatherService, GeoService, localStorageService) {
        $scope.filter = {
            units: 'si',
            location: ''
        };

        $scope.weather = {};

        $scope.loading = false;

        var weather;
        if (weather = localStorageService.get('weather')) {
            $scope.weather = JSON.parse(weather);
        }

        WeatherService.when('location.changed', function () {
            $scope.loading = true;
            WeatherService.get({units: $scope.filter.units}).then(function (results) {
                localStorageService.set('weather', JSON.stringify(results));

                $scope.weather = results;
                $scope.loading = false;
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
            $scope.loading = true;
            if ($scope.filter.location.length) {
                GeoService.geodecode($scope.filter.location).then(function () {
                    $scope.loading = false;
                });
            } else {
                $scope.$emit('location.changed');
            }

            return false;
        };

        $scope.timezoneToCity = function (timezone) {
            return timezone.split('/').join("<br />");
        }
    }]);