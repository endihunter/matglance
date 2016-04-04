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
                $scope.data.location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            });
        }

        getLocation();
    });
}]);