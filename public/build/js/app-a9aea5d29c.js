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
var app = angular.module('app', ['ngSanitize']);

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
            'includeSpamTrash': !!$scope.includeSpamTrash,
            'q': buildQuery()
        };

        GmailService.fetchMessages(args)
            .then(function (messages) {
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
app.controller('WeatherController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.data = {
        units: 'celsius',
        location: ''
    };

    $scope.error = null;

    /**
     * Save module preferences
     * @returns {boolean}
     */
    $scope.savePreferences = function () {
        console.log('saving weather prefs', $scope.data);

        return false;
    };

    /**
     * Detect geolocation
     */
    $timeout(function () {
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setPosition);
            } else {
                $scope.error = "Geolocation is not supported by this browser.";
            }
        }

        function setPosition(position) {
            angular.safeApply($scope, function ($scope) {
                $scope.data.location = [
                    position.coords.latitude,
                    position.coords.longitude
                ].join(' x ');
            });
        }

        getLocation();
    });
}]);
app.directive('cardBox', ['$timeout', function ($timeout) {
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
            }
        },
        'templateUrl': '/assets/templates/card-box.html'
    };
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
//# sourceMappingURL=app.js.map
