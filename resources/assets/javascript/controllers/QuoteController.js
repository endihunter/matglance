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
            angular.safeApply($scope, function ($scope) {
                $scope.quote = angular.extend($scope.quote, response.data.data);
                $scope.loading = false;
            });
        });
    }
}]);