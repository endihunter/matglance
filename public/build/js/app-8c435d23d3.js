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
var app = angular.module('app', []);

app.run(['$rootScope', function ($rootScope) {
    
}]);

app.API_PREFIX = '/api/v1';

app.controller('CalendarController', ['$scope', function ($scope) {
    
}]);
app.controller('GmailController', ['$scope', 'GmailService', function ($scope, GmailService) {
    $scope.filter = {
        'labelIds': [],
        'q': '',
        'includeSpamTrash': false,
        'maxResults': 5
    };

    $scope.messages = [];

    GmailService.fetchMessages($scope.filter)
        .then(function (messages) {
            $scope.messages = messages;
        })
        .catch(function () {
            console.error(arguments);
        });

    $scope.readMessage = function (id) {
        alert('Coming soon.');
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
            $scope.quote = angular.extend($scope.quote, response.data.data);
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
            scope.switchEditableMode = function () {
                scope.editable = !scope.editable;
            }
        },
        'templateUrl': '/assets/templates/card-box.html'
    };
}]);
app.factory('GmailService', ['$http', function ($http) {
    var factory = {};

    factory.fetchMessages = function (filter) {
        return $http.get(app.API_PREFIX + '/gmail/messages', filter)
            .then(function (response) {
                return response.data.data;
            });
    };

    return factory;
}]);
//# sourceMappingURL=app.js.map
