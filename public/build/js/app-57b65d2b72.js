/**
 * @param {Scope} scope
 * @param {Function} callback
 */
angular.safeApply = function (scope, callback) {
    scope[(scope.$$phase || scope.$root.$$phase) ? '$eval' : '$apply'](callback || function() {});
};

angular.isMobile = (function(a)
{
    return /((iP([oa]+d|(hone)))|Android|WebOS|BlackBerry|windows (ce|phone))/i.test(a);
})(navigator.userAgent||navigator.vendor||window.opera);

angular.isOnline = function isOnline()
{
    var isOnline = (window.navigator && window.navigator.onLine);
    console.log("Online", isOnline);

    return isOnline;
};
var app = angular.module('app', ['ngSanitize', 'LocalStorageModule']);

app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ymag_');
    localStorageServiceProvider.setStorageCookie(1, '/');
}]);

app.run(['$rootScope', function ($rootScope) {
    window.onclick = function (event) {
        if (0 == $(event.target).closest('div.card-actions.dropdown.open').length
            && 0 == $(event.target).closest('#cities-list').length) {
            $rootScope.$broadcast('cardbox.close');
        }
    }
}]);

app.API_PREFIX = '/api/v1';

app.controller('CalendarController', ['$scope', function ($scope) {
    
}]);
app.controller('GmailController', ['$scope', 'GmailService', '$sce', 'localStorageService',
    function ($scope, GmailService, $sce, localStorageService) {
        $scope.searchMode = false;

        $scope.message = null;

        $scope.loading = false;

        var emptyFilter = function () {
            return {
                'from': '',
                'to': '',
                'subject': '',
                'includeSpamTrash': false
            };
        };

        var savedFilter;
        if (! (savedFilter = localStorageService.get('g_fltr'))) {
            savedFilter = JSON.stringify(emptyFilter());
            localStorageService.set('g_fltr', savedFilter);
        }

        $scope.filter = JSON.parse(savedFilter);

        $scope.messages = JSON.parse(localStorageService.get('g_msgs')) || [];

        $scope.query = buildQuery();

        function buildQuery() {
            $scope.query = '';

            var q = [];
            angular.forEach(['from', 'to', 'subject'], function (field, index, values) {
                var value = $scope.filter[field];

                if (value.length) {
                    q.push(field + ': (' + value + ')');
                }
            });

            $scope.query = q.join(" ").trim();

            return $scope.query;
        }

        $scope.fetchMessages = function () {
            $scope.loading = true;

            // save filter
            localStorageService.set('g_fltr', savedFilter = JSON.stringify($scope.filter));

            var args = {
                'includeSpamTrash': !!$scope.filter.includeSpamTrash,
                'q': buildQuery()
            };

            GmailService.fetchMessages(args)
                .then(function (messages) {
                    // restore listing view
                    angular.safeApply($scope, function ($scope) {
                        $scope.messages = messages;

                        $scope.loading = false;

                        localStorageService.set('g_msgs', JSON.stringify(messages));
                    });
                })
                .catch(function () {
                    $scope.loading = false;
                });
        };

        // fetch messages on page ready
        $scope.fetchMessages();

        $scope.isUnRead = function (message) {
            return message.hasOwnProperty('labels')
                && (-1 < message.labels.indexOf('UNREAD'));
        };

        $scope.fullMessageUrl = function (messageId) {
            return $sce.trustAsResourceUrl('/gmail/messages/' + messageId + '/body');
        };

        $scope.toggleSearchMode = function (flag, callback) {
            if (!flag) {
                $scope.filter = JSON.parse(savedFilter);
            }

            $scope.searchMode = !!flag;

            if (callback) {
                callback();
            }
        };

        $scope.backToList = function () {
            $scope.message = null;
        };

        $scope.readMessage = function (messageId) {
            $scope.loading = true;

            GmailService.get(messageId)
                .then(function (message) {
                    angular.safeApply($scope, function ($scope) {
                        $scope.message = message;

                        $scope.loading = false;

                        var currentMessage = $scope.messages.filter(function (message) {
                            return message.id == messageId;
                        })[0];

                        $scope.messages.map(function (message) {
                            if (message.id == messageId && $scope.isUnRead(message)) {
                                var index = message.labels.indexOf('UNREAD');

                                message.labels.splice(index, 1);

                                GmailService.markAsRead(messageId);
                            }

                            return message;
                        });
                    });
                })
                .catch(function () {
                    console.log(arguments);

                    $scope.loading = false;
                });
        }
    }]);
app.controller('QuoteController', ['$scope', '$http', function ($scope, $http) {
    $scope.quote = {
        id: null,
        quote: '',
        author: ''
    };

    $scope.loading = false;

    /**
     * Fetch random quote
     */
    $scope.fetchRandom = function () {
        $scope.loading = true;
        $http.get(app.API_PREFIX + '/quotes/random').then(function (response) {
            $scope.quote = response.data;
            $scope.loading = false;
        });
    }
}]);
app.controller('RssController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.savePreferences = function () {
        console.log('saving rss prefs', $scope.data);

        return false;
    };
}]);
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
                        var address = /*$scope.filter.location = */result.formatted_address;
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
app.directive('cardBox', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
    return {
        'restrict': "E",
        'scope': {
            'title': "@"
        },
        'transclude': {
            'actions': '?cardBoxActions',
            'body': 'cardBoxBody'
        },
        'link': function (scope, element) {
            scope.editable = false;

            /**
             * toggle the actions button if no actions content provided
             * @type {boolean}
             */
            $timeout(function () {
                scope.hasActions = !!element.find('card-box-actions').text().length;
            });

            /**
             * Toggle box's preferences
             */
            scope.switchEditableMode = function (callback) {
                scope.editable = !scope.editable;

                if (callback) {
                    callback();
                }
            };

            function close() {
                angular.safeApply(scope, function (scope) {
                    scope.editable = false;
                });
            }

            scope.close = close;

            $rootScope.$on('cardbox.close', close);
        },
        'templateUrl': '/assets/templates/card-box.html'
    };
}]);
app.directive('skycon', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            icon: "@"
        },
        link: function (scope, element, attribs) {
            scope.size = attribs.size || 128;

            var initIcon = function () {
                var skycons = new Skycons({'color': 'grey'});

                // you can add a canvas by it's ID...
                var draw = attribs.icon.split('-').join('_').toUpperCase();
                skycons.add(document.getElementById('skycon'), Skycons[draw]);

                // start animation!
                skycons.play();
            };
            initIcon();

            attribs.$observe('icon', initIcon);
        },
        template: '<canvas id="skycon"></canvas>'
    };
});
app.factory('GeoService', ['$q', '$http', function ($q, $http) {
    var factory = {
        lat: null,
        lng: null
    };

    factory.setLocation = function (lat, lng) {
        factory.lat = parseFloat(lat);
        factory.lng = parseFloat(lng);

        return factory;
    };

    factory.getLatitude = function () {
        return this.lat;
    };

    factory.getLongitude = function () {
        return this.lng;
    };

    function setDefaultLocation() {
        factory.setLocation(
            40.7127837,
            -74.0059413
        );

        return factory;
    }

    /**
     * Locate the client by asking Navigator.GeoLocation.
     */
    factory.geolocate = function () {
        var defer = $q.defer();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                factory.setLocation(
                    position.coords.latitude,
                    position.coords.longitude
                );

                defer.resolve(factory);
            }, function (blocked) {
                defer.resolve(
                    setDefaultLocation()
                );
            });
        } else {
            // set default location to new york
            defer.resolve(
                setDefaultLocation()
            );
        }

        return defer.promise;
    };

    factory.geocode = function (location) {
        return $http.get(app.API_PREFIX + '/geo/code?loc=' + location)
            .then(function (response) {
                return response.data.results[0];
            });
    };

    factory.lookup = function (lat, lng) {
        return $http.get(app.API_PREFIX + '/geo/lookup?latlng=' + [lat, lng].join(','))
            .then(function (response) {
                return response.data.results[0];
            });
    };

    return factory;
}]);
app.factory('GmailService', ['$http', '$httpParamSerializer', function ($http, $httpParamSerializer) {
    var factory = {};

    /**
     * Fetch the messages list that match criteria.
     *
     * @param args
     * @returns {*}
     */
    factory.fetchMessages = function (args) {
        return $http.get(app.API_PREFIX + '/gmail/messages?' + $httpParamSerializer(args))
            .then(function (response) {
                return response.data.data;
            });
    };

    /**
     * Fetch the message.
     *
     * @param messageId
     * @returns {*}
     */
    factory.get = function (messageId) {
        return $http.get(app.API_PREFIX + '/gmail/messages/' + messageId + '?include=body')
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Mark message as Read.
     *
     * @param messageId
     * @returns {*}
     */
    factory.markAsRead = function (messageId) {
        return $http.get(app.API_PREFIX + '/gmail/messages/' + messageId + '/touch');
    };

    return factory;
}]);
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
//# sourceMappingURL=app.js.map
