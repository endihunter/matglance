app.controller('WeatherController', [
    '$scope', '$timeout', 'WeatherService', 'GeoService', 'localStorageService',
    function ($scope, $timeout, WeatherService, GeoService, localStorageService) {
        var cachedFilter = localStorageService.get('weather_filter');
        var filterChanged = false, weather, location;

        $scope.filter = angular.extend({
            units: 'si',
            location: ""
        }, cachedFilter ? JSON.parse(cachedFilter) : {});

        $scope.weather = {};

        $scope.loading = false;

        $scope.$watch('filter', function (n1, n2) {
            if (n1 === n2) return false;
            filterChanged = true;

            localStorageService.set('weather_filter', JSON.stringify($scope.filter));
        }, true);

        // fetch last weather data from cache
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
            $scope.weather = null;
            WeatherService.get(currentLocation(), {units: $scope.filter.units}).then(function (results) {
                $scope.weather = results;
                localStorageService.set('weather', JSON.stringify(results));
            });
        });

        if (!(location = localStorageService.get('location'))) {
            GeoService.geolocate().then(function (GeoService) {
                var location = {
                    lat: GeoService.getLatitude(),
                    lng: GeoService.getLongitude()
                };

                console.log(location);

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
            if (! filterChanged) return false;

            $scope.loading = true;

            if (filterChanged && $scope.filter.location.length) {
                filterChanged = false;
                GeoService.geocode($scope.filter.location).then(function (result) {
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
            if (! timezone) return '';
            return timezone.split('/').pop().split('_').join(' ');
        }
    }]);