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

    return isOnline;
};

angular.storagePrefix = function (path) {
    var namespace = [
        'ymag', window['gid']
    ];

    if (path && path.length) {
        namespace.push(path);
    }

    return namespace.join('.');
};
var app = angular.module('app', ['ngSanitize', 'LocalStorageModule']);

app.config(['localStorageServiceProvider', '$httpProvider', function (localStorageServiceProvider, $httpProvider) {
    var namespace = angular.storagePrefix();
    $httpProvider.defaults.headers.common.Authorization = 'Bearer ' + window['api_token'];
    localStorageServiceProvider.setPrefix(namespace);
    localStorageServiceProvider.setStorageCookie(1, '/');
}]);

app.run(['$rootScope', function ($rootScope) {
    window.onclick = function (event) {
        if (0 == $(event.target).closest('div.card-actions.dropdown.open').length
            && 0 == $(event.target).closest('#cities-list').length) {
            $rootScope.$broadcast('cardbox.close');
        }
    };
}]);

app.REWRITE_BASE = '/';
if (location.host == 'dev-your-morning.rainbowriders.dk') {
    app.REWRITE_BASE = '/public/';
}

app.API_PREFIX = app.REWRITE_BASE + 'api/v1';

app.controller('CalendarController', [
    '$scope', '$rootScope', 'EventsService', 'localStorageService',
    function ($scope, $rootScope, EventsService, localStorageService) {

        $scope.calendars = [];
        $scope.events = [];
        $scope.hasEvents = false;
        $scope.calendarEvents = [];
        
        $scope.init = function init (calendars) {

            $scope.calendars = calendars;
            setDefaultCalendar();

        };

        $scope.savePreferences = function savePreferences (cb) {

            var temp = [];

            for(var i = 0; i < $scope.calendars.length; i++) {
                if($scope.calendars[i].selected == true) {
                    temp.push($scope.calendars[i]);
                }
            }

            localStorageService.set(
                'cal',
                JSON.stringify(angular.copy(temp)));

            fetchEvents();

            if(cb) {
                cb();
            }
        };

        $scope.cancel = function cancel (callback) {
            resetCalendarsStatus();
            setDefaultCalendarsStatus(getSavedCalendars());
            if(callback) {
                callback();
            }
        };

        $scope.select = function (calendar) {
            checkUncheckCalendar(calendar);
        };

        $scope.$on('cardbox.close', function () {
            resetCalendarsStatus();
            setDefaultCalendarsStatus(getSavedCalendars());
        });

        $scope.$watchCollection('calendarEvents', function () {
            $scope.events = [];
            for( var i = 0; i < $scope.calendarEvents.length; i++) {

                for (var a in $scope.calendarEvents[i]) {
                    $scope.events.push($scope.calendarEvents[i][a]);
                }
            }
            if($scope.events.length > 0) {
                $scope.hasEvents = true;
            }
            $scope.events.sort(function (a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a < b ? -1 : a > b ? 1 : 0;
            });
        });

        function setDefaultCalendar() {
            var saved = getSavedCalendars();

            if(!saved || saved == null) {
                $scope.calendars[0].selected = true;
                var temp = [];
                temp.push($scope.calendars[0]);
                localStorageService.set(
                    'cal',
                    JSON.stringify(angular.copy(temp)));
            } else {
                setDefaultCalendarsStatus(saved);
            }

            fetchEvents();
        }

        function checkUncheckCalendar(calendar) {

            for(var i =0; i < $scope.calendars.length; i++) {

                if($scope.calendars[i].id == calendar.id) {

                    // First time loaded
                    if(!$scope.calendars[i].selected || $scope.calendars[i].selected == 'undefined') {
                        $scope.calendars[i].selected = true;
                    } else {  // if user make changed
                        $scope.calendars[i].selected = !$scope.calendars[i].selected;
                    }
                }
            }
        }

        function getSavedCalendars() {
            return JSON.parse(localStorageService.get('cal'));
        }

        function setDefaultCalendarsStatus(calendars) {
            for(var i =0; i < calendars.length; i++) {
                setDefaultCalendarStatus(calendars[i]);
            }
        }

        function setDefaultCalendarStatus(calendar) {
            for( var i = 0; i < $scope.calendars.length; i++) {
                if(calendar.id == $scope.calendars[i].id) {
                    $scope.calendars[i].selected = calendar.selected || false;
                    break;
                }
            }
        }

        function resetCalendarsStatus() {
            for (var i = 0; i <$scope.calendars.length; i++) {
                $scope.calendars[i].selected = false;
            }
        }

        function fetchEvents () {
            $scope.calendarEvents = [];
            $scope.hasEvents = false;
            for (var i = 0; i < $scope.calendars.length; i++) {
                if($scope.calendars[i].selected == true) {
                    EventsService.events($scope.calendars[i].id)
                        .then(function (res) {
                            $scope.calendarEvents.push(res);
                            console.log(res);
                        });
                }
            }
        }
    }]);
app.controller('GmailController', ['$scope', 'GmailService', '$sce', 'localStorageService',
    function ($scope, GmailService, $sce, localStorageService) {
        $scope.searchMode = true;

        $scope.message = null;

        $scope.loading = false;

        $scope.nextPageToken = null;

        var emptyFilter = function () {
            return {
                'from': '',
                'to': '',
                'subject': '',
                'includeSpamTrash': false
            };
        };

        var savedFilter;
        if (!(savedFilter = localStorageService.get('g_fltr'))) {
            savedFilter = JSON.stringify(emptyFilter());
            localStorageService.set('g_fltr', savedFilter);
        }

        $scope.filter = JSON.parse(savedFilter);

        $scope.messages = [];

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

        $scope.savePreferences = function (cb) {
            $scope.messages = [];
            $scope.nextPageToken = null;

            return $scope.fetchMessages(cb);
        };

        $scope.next = $scope.fetchMessages = function (cb) {
            if ($scope.loading) return false;

            $scope.loading = true;

            // save filter
            localStorageService.set('g_fltr', savedFilter = JSON.stringify($scope.filter));

            var args = {
                'includeSpamTrash': !!$scope.filter.includeSpamTrash,
                'q': buildQuery(),
                'nextPageToken': $scope.nextPageToken
            };

            return GmailService.fetchMessages(args)
                .then(function (messages) {
                    if (cb) {
                        cb();
                    }

                    // restore listing view
                    angular.safeApply($scope, function ($scope) {
                        for (var i in messages.messages) {
                            $scope.messages.push(messages.messages[i]);
                        }
                        $scope.nextPageToken = messages.nextPage;

                        $scope.loading = false;
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
            return $sce.trustAsResourceUrl(app.API_PREFIX + '/gmail/messages/' + messageId + '/body');
        };

        $scope.toggleSearchMode = function (flag, callback) {
            if (!flag) {
                $scope.filter = JSON.parse(savedFilter);
            }

            // $scope.searchMode = !!flag;

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
        if ($scope.loading) return false;

        $scope.loading = true;
        $http.get(app.API_PREFIX + '/quotes/random').then(function (response) {
            $scope.quote = response.data;
            $scope.loading = false;
        });
    }
}]);
app.controller('RssController', [
    '$scope', '$timeout', 'localStorageService', 'FeedService', '$q',
    function ($scope, $timeout, localStorageService, FeedService, $q) {
        $scope.loading = false;

        function key(path) {
            return window['lang'] + '.' + path;
        }

        function fullList() {
            return mapToInt(_.pluck($scope.allFeeds, 'id'));
        }

        function mapToInt(values) {
            return values.map(function (value) {
                return parseInt(value);
            });
        }

        function restoreReadableFeeds() {
            var savedFeeds;
            var hasSavedFeeds = localStorageService.keys().indexOf(key('feeds')) > -1;

            $feeds = [];

            if (!hasSavedFeeds) {
                $feeds = fullList();
            } else {
                savedFeeds = localStorageService.get(key('feeds'));
                if (savedFeeds.length) {
                    $feeds = mapToInt(savedFeeds.split(','));
                }
            }

            $scope.savedFeeds = angular.copy($feeds);

            allChecked();
        }

        function fetchNews() {
            var defer = $q.defer();

            if ($scope.loading || !$feeds.length) {
                defer.resolve([]);
            } else {
                $scope.loading = true;

                FeedService.news($feeds).then(function (news) {
                    $scope.loading = false;
                    $scope.articles = news;
                    defer.resolve(news);
                });
            }
            return defer.promise;
        }

        $scope.allChecked = false;

        // all feeds
        $scope.allFeeds = [];

        // readable feeds
        var $feeds = [];

        $scope.savedFeeds = [];

        $scope.articles = [];

        function allChecked() {
            $scope.allChecked = ($feeds.length == $scope.allFeeds.length);
        }

        $scope.$watch('feeds', function (v1, v2) {
            if (v1 === v2) return false;

            allChecked();
        }, true);

        $scope.toggleAll = function ($event) {
            if ($event.target.checked == true) {
                $feeds = fullList();
            } else {
                $feeds = [];
            }
        };

        $scope.init = function (allFeeds) {
            $scope.allFeeds = allFeeds;

            restoreReadableFeeds();

            fetchNews();
        };

        $scope.savePreferences = function (cb) {
            $scope.savedFeeds = mapToInt($feeds);

            localStorageService.set(key('feeds'), $scope.savedFeeds.join(','));

            return fetchNews().then(function () {
                if (cb) {
                    cb();
                }
            });
        };

        $scope.cancel = function (cb) {
            restoreReadableFeeds();

            if (cb) {
                cb();
            }
        };

        $scope.trackUntrack = function (feed_id) {
            feed_id = parseInt(feed_id);

            if ($scope.trackable(feed_id)) {
                $feeds = _.without($feeds, feed_id);
            } else {
                $feeds.push(feed_id);
            }
        };

        $scope.trackable = function (feed_id) {
            feed_id = parseInt(feed_id);

            return _.indexOf($feeds, feed_id) != -1;
        }
    }]);
app.controller('SizerController', ['$scope', '$window', function ($scope, $window) {
    function getMultiplier() {
        if ($.browser.msie) {
            return 0.68;
        }

        return 0.8;
    }

    var resize = function() {
        var k = getMultiplier();

        var viewport = $(window).height();
        var height = Math.round(viewport * k);

        if (! angular.isMobile) {
            $scope.size1 = Math.round(height * 0.35);
            $scope.size2 = Math.round(height * 0.45);
            $scope.size3 = height - ($scope.size1 + $scope.size2);
        } else {
            $scope.size1 = 200;
            $scope.size2 = 240;
            $scope.size3 = 150;
        }

        $scope.resized = true;
    };
    setTimeout(resize, 100);

    $(window).on('resize', resize);
}]);
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
        'templateUrl': app.REWRITE_BASE + 'assets/templates/card-box.html'
    };
}]);
app.directive('eventIcon', [function () {
    return {
        restrict: "E",
        scope: null,
        link: function (scope, element, attribs) {
            var event = JSON.parse(attribs.event);
            var icon = null;

            if (event.birthday) {
                icon = 'ti-gift';
            } else if (! event.allDay) {
                icon = 'ti-alarm-clock';
            }

            scope.icon = icon;
        },
        template: '<i ng-if="icon" class="{{ icon }}">&nbsp;</i>'
    };
}]);
app.factory('EventsService', ['$http', '$httpParamSerializer', function ($http, $httpParamSerializer) {
    var factory = {};

    factory.events = function (calendar) {
        var args = $httpParamSerializer({
            'c': calendar,
            't': (new Date).getTime(),
            'tz' : 0//(new Date).getTimezoneOffset()
        });
        return $http.get(app.API_PREFIX + '/calendar/events?' + args)
            .then(function (response) {
                return response.data.data;
            });
    };

    return factory;
}]);
app.factory('FeedService', ['$http', '$httpParamSerializer', function ($http, $httpParamSerializer) {
    var factory = {};

    factory.news = function (feeds) {
        var args = $httpParamSerializer({
            ids: feeds.join(',')
        });
        return $http.get(app.API_PREFIX + '/feed/news?' + args)
            .then(function (response) {
                return response.data.data;
            });
    };

    return factory;
}]);
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

    function fetchLocationUsingIP(defer) {
        $http.get(app.API_PREFIX + '/geo/ip').then(function (response) {
            var data = response.data;
            if (data.cityName.length && '-' != data.cityName) {
                factory.setLocation(
                    data.latitude,
                    data.longitude
                );
                defer.resolve(factory);
            } else {
                defer.resolve(
                    setDefaultLocation()
                );
            }
        }).catch(function () {
            defer.resolve(
                setDefaultLocation()
            );
        });
    }

    /**
     * Locate the client by asking Navigator.GeoLocation.
     */
    factory.geolocate = function () {
        var defer = $q.defer();

        // setTimeout(function () {
        //     return fetchLocationUsingIP(defer);
        // }, 5000);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                factory.setLocation(
                    position.coords.latitude,
                    position.coords.longitude
                );

                defer.resolve(factory);
            }, function () {
                return fetchLocationUsingIP(defer);
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
                return response.data;
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
app.factory("WeatherService", ['$http', '$httpParamSerializer', function ($http, $httpParamSerializer) {
    var factory = {};

    factory.fetch = function (coords, params) {
        var $args = angular.extend({
            coords: coords,
            units: 'si'
        }, params || {});

        var $url = app.API_PREFIX + '/weather/get?' + $httpParamSerializer($args);
        return $http
            .get($url)
            .then(function (response) {
                return response.data;
            });
    };

    return factory;
}]);
//# sourceMappingURL=app.js.map
