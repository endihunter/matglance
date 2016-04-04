app.controller('RssController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.savePreferences = function () {
        console.log('saving rss prefs', $scope.data);

        return false;
    };
}]);