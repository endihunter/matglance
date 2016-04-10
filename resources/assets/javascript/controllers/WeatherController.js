app.controller('WeatherController', [
    '$scope', '$timeout', 'WeatherService', 'GeoService', 'localStorageService', '$http',
    function ($scope, $timeout, WeatherService, GeoService, localStorageService, $http) {
        var filterChanged = false, weather, location;

        $scope.cities = [];

        $scope.filter = {
            units: 'si',
            location: ""
        };

        $scope.weather = {};

        $scope.loading = false;

        function searchForCity(name) {
            $http.get(app.API_PREFIX + '/geo/places/?name=' + name)
                .then(function (response) {
                    var cities = _.uniq(response.data.predictions) || [];

                    $scope.cities = cities;
                });
        }

        // skipTracking used when city is predicted by Places API and directly inserted into filter.location
        // so to prevent double checking, temporary skip this step
        var skipTracking = false;

        function addressModified(n1, n2) {
            return n1.location !== n2.location && n1.location.length >= 3;
        }

        $scope.$watch('filter', function (n1, n2) {
            if (skipTracking || n1 === n2) return false;
            filterChanged = true;

            if (addressModified(n1, n2)) {
                searchForCity(n1.location);
            }

            // restore tracking:
            skipTracking = false;
        }, true);

        function restoreSavedFilter() {
            delayFilterTracking();

            $scope.filter = angular.extend({
                units: $scope.weather.units,
                location: $scope.weather.location
            }, $scope.filter);
        }

        // fetch last weather data from cache
        if (weather = localStorageService.get('weather')) {
            $scope.weather = JSON.parse(weather);

            // restore filter from cache
            restoreSavedFilter();
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
                $scope.weather = angular.extend(results, $scope.filter);
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

        $scope.cancel = function (callback) {
            restoreSavedFilter();

            if (callback) {
                callback();
            }
        };

        /**
         * Save module preferences
         * @returns {boolean}
         */
        $scope.savePreferences = function () {
            if (!filterChanged) return false;

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

        $scope.locationToCity = function (location) {
            if (!location || !location.indexOf(',')) return '';

            return _.first(
                location.split(', ')
            );
        };

        function delayFilterTracking() {
            skipTracking = true;

            $timeout(function () {
                skipTracking = false;
            }, 100);
        }

        $scope.selectCity = function (city) {
            delayFilterTracking();

            $scope.filter.location = city.description;

            $scope.cities = null;
        }
    }]);