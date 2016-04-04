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

    $scope.savePreferences = function () {
        console.log('saving weather prefs', $scope.data);

        return false;
    };

    $timeout(function () {
        function getLocation() {
            if (navigator.geolocation) {
                console.log('geolocation', navigator.geolocation);
                navigator.geolocation.getCurrentPosition(setPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function setPosition(position) {
            angular.safeApply($scope, function ($scope) {
                $scope.data.location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            });
        }

        getLocation();
    });
}]);
app.directive('cardBox', function () {
    return {
        'restrict': "E",
        'scope': {
            'title': "@"
        },
        'transclude': {
            'actions': '?cardBoxActions',
            'body': '?cardBoxBody'
        },
        'link': function (scope) {
            scope.editable = false;

            scope.switchEditableMode = function () {
                scope.editable = ! scope.editable;
            }
        },
        'templateUrl': '/assets/templates/card-box.html'
    };
});
//# sourceMappingURL=app.js.map
