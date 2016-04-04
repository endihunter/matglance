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