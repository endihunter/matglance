app.controller('WeatherController', [
    '$scope', '$timeout', 'WeatherService', 'GeoService', 'localStorageService', '$http',
    function ($scope, $timeout, WeatherService, GeoService, localStorageService, $http) {
        var filterChanged = false, savedFilter;

        var defaultFilter = {
            units: 'si',
            location: {},
            address: ""
        };

        $scope.cities = [];

        $scope.filter = angular.copy(defaultFilter);

        $scope.weather = {};

        $scope.loading = false;

        function searchForCity(name) {
            $http.get(app.API_PREFIX + '/geo/places?name=' + name)
                .then(function (response) {
                    var cities = _.uniq(response.data.predictions) || [];

                    $scope.cities = cities;
                });
        }

        // skipTracking used when city is predicted by Places API and directly inserted into filter.location
        // so to prevent double checking, temporary skip this step
        var skipTracking = false;

        function addressModified(n1, n2) {
            return n1.address !== n2.address && n1.address.length >= 3;
        }

        $scope.$watch('filter', function (n1, n2) {
            if (skipTracking || n1 === n2) return false;
            filterChanged = true;

            if (addressModified(n1, n2)) {
                searchForCity(n1.address);
            }

            // restore tracking:
            skipTracking = false;
        }, true);

        function restoreSavedFilter() {
            delayFilterTracking();

            $scope.filter = angular.copy(defaultFilter);
        }

        function finish(cb) {
            if (cb) {
                cb();
            }
        }

        function cacheFilter() {
            localStorageService.set('w_fltr', JSON.stringify(_.omit($scope.filter, 'address')));

            defaultFilter = angular.copy($scope.filter);
        }

        function loadCachedFilter() {
            return JSON.parse(localStorageService.get('w_fltr'));
        }

        function currentLocation() {
            return [
                $scope.filter.location.lat,
                $scope.filter.location.lng
            ].join(",")
        }

        // when location or units did change => fetch new weather and set to cache
        $scope.$on('location.changed', function () {
            WeatherService.fetch(currentLocation(), {units: $scope.filter.units}).then(function (results) {
                $scope.weather = angular.extend(results, $scope.filter);
            });
        });

        if (!(savedFilter = loadCachedFilter())) {
            GeoService.geolocate().then(function (GeoService) {
                $scope.filter.location = {
                    lat: GeoService.getLatitude(),
                    lng: GeoService.getLongitude()
                };

                lookup();
            });
        } else {
            $scope.filter = angular.copy(savedFilter);
            defaultFilter = angular.copy($scope.filter);

            lookup(savedFilter.location.lat, savedFilter.location.lng);
        }

        function lookup(lat, lng) {
            GeoService.lookup(lat || GeoService.getLatitude(), lng || GeoService.getLongitude()).then(function (result) {
                delayFilterTracking();
                $scope.filter.address = result.formatted_address;

                cacheFilter();

                $scope.$emit('location.changed');
            });
        }

        $scope.cancel = function (callback) {
            restoreSavedFilter();

            finish(callback);
        };

        /**
         * Save module preferences
         * @returns {boolean}
         */
        $scope.savePreferences = function (callback) {
            if (!filterChanged)
                return false;

            if ($scope.loading)
                return false;

            $scope.loading = true;

            if (filterChanged && $scope.filter.address.length) {
                filterChanged = false;
                GeoService.geocode($scope.filter.address).then(function (result) {
                    if (result && result.hasOwnProperty('geometry')) {
                        delayFilterTracking();

                        $scope.filter = angular.extend($scope.filter, {
                            // address: result.formatted_address,
                            location: result.geometry.location
                        });

                        cacheFilter();

                        $scope.$emit('location.changed');

                        finish(callback);
                    }

                    $scope.loading = false;
                });
            } else {
                $scope.$emit('location.changed');

                finish(callback);
            }

            return false;
        };

        $scope.locationToCity = function (address) {
            if (!address || !address.indexOf(',')) return '';

            return _.first(
                address.split(', ')
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

            $scope.filter.address = city.description;

            $scope.cities = null;
        };

        $scope.icon = function () {
            return app.REWRITE_BASE + 'icons/w/' + $scope.weather.currently.icon + '.png';
        }
    }]);