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
    
}]);

app.API_PREFIX = '/api/v1';

app.controller('CalendarController', ['$scope', function ($scope) {
    
}]);
app.controller('GmailController', ['$scope', 'GmailService', '$sce', function ($scope, GmailService, $sce) {
    $scope.searchMode = false;

    $scope.message = null;

    $scope.loading = false;

    $scope.filter = {
        'from': '',
        'to': '',
        'subject': '',
        'includeSpamTrash': false
    };

    $scope.$watch('filter', function () {
        console.log($scope.filter);
    },true);

    $scope.messages = [];

    $scope.query = '';

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

        var args = {
            'includeSpamTrash': !!$scope.filter.includeSpamTrash,
            'q': buildQuery()
        };

        GmailService.fetchMessages(args)
            .then(function (messages) {
                // restore listing view
                $scope.message = null;

                angular.safeApply($scope, function ($scope) {
                    $scope.messages = messages;

                    $scope.loading = false;
                });
            })
            .catch(function () {
                console.error(arguments);
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

    $scope.toggleSearchMode = function () {
        $scope.searchMode = !$scope.searchMode;

        if (!$scope.searchMode) {
            $scope.switchEditableMode();
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

                if (callback) {}
            };
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
        },
        template: '<canvas id="skycon"></canvas>'
    };
});
app.factory('GeoService', ['$q', function ($q) {
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

    /**
     * Locate the client by asking Navigator.GeoLocation.
     */
    factory.locate = function () {
        var defer = $q.defer();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                factory.setLocation(
                    position.coords.latitude,
                    position.coords.longitude
                );

                defer.resolve(factory);
            });
        } else {
            defer.reject('Geolocation is not supported.');
        }

        return defer.promise;
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
app.factory("WeatherService", ['$http', '$rootScope', 'GeoService', '$httpParamSerializer',
    function ($http, $rootScope, GeoService, $httpParamSerializer) {
        var factory = {};

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

        factory.get = function (params) {
            var coords = [
                GeoService.getLatitude(),
                GeoService.getLongitude()
            ].join(",");

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
