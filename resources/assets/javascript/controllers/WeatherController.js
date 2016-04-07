app.controller('WeatherController', [
    '$scope', '$timeout', 'WeatherService', 'GeoService', 'localStorageService',
    function ($scope, $timeout, WeatherService, GeoService, localStorageService) {
        $scope.filter = {
            units: 'si',
            location: ''
        };

        $scope.filterChanged = false;

        $scope.$watch('filter', function (n1, n2) {
            if (n1 === n2) return false;
            $scope.filterChanged = true;
        }, true);

        $scope.weather = {};

        $scope.loading = false;

        // fetch last weather data from cache
        var weather;
        if (weather = localStorageService.get('weather')) {
            $scope.weather = JSON.parse(weather);
        }

        function currentLocation() {
            return [
                GeoService.getLatitude(),
                GeoService.getLongitude()
            ].join(",")
        }

        // when location or units did change => fetch new weather and set to cache
        $scope.$on('location.changed', function () {
            WeatherService.get(currentLocation(), {units: $scope.filter.units}).then(function (results) {
                $scope.weather = results;
                localStorageService.set('weather', JSON.stringify(results));
            });
        });

        var location;
        if (!(location = localStorageService.get('location'))) {
            GeoService.geolocate().then(function (GeoService) {
                var location = {
                    lat: GeoService.getLatitude(),
                    lng: GeoService.getLongitude()
                };

                GeoService.lookup(location.lat, location.lng).then(function (result) {
                    var address = result.formatted_address;

                    localStorageService.set('location', JSON.stringify({
                        address: address,
                        location: location
                    }));

                    $scope.filter.location = address;

                    $scope.$emit('location.changed');
                });
            });
        } else {
            var location = JSON.parse(location);
            var coords = location.location;
            $scope.filter.location = location.address;
            GeoService.setLocation(coords.lat, coords.lng);
            $scope.$emit('location.changed');
        }


        /**
         * Save module preferences
         * @returns {boolean}
         */
        $scope.savePreferences = function () {
            if (! $scope.filterChanged) return false;

            $scope.loading = true;

            if ($scope.filterChanged && $scope.filter.location.length) {
                $scope.filterChanged = false;
                GeoService.geodecode($scope.filter.location).then(function (result) {
                    if (result && result.hasOwnProperty('geometry')) {
                        var address = $scope.filter.location = result.formatted_address;
                        var location = result.geometry.location;

                        GeoService.setLocation(location.lat, location.lng);

                        $scope.$emit('location.changed');

                        localStorageService.set('location', JSON.stringify({
                            address: address,
                            location: {
                                lat: location.lat,
                                lng: location.lng
                            }
                        }));
                    }

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