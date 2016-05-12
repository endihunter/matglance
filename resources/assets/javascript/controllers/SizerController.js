app.controller('SizerController', ['$scope', '$window', function ($scope, $window) {
    var resize = function() {
        var viewport = $(window).height();
        var height = Math.round(viewport * .8);

        if (! angular.isMobile && height >= 740) {
            $scope.size1 = Math.round(height * 0.34);
            $scope.size2 = Math.round(height * 0.45);
            $scope.size3 = height - ($scope.size1 + $scope.size2);
        } else {
            $scope.size1 = 200;
            $scope.size2 = 240;
            $scope.size3 = 150;
        }

        $scope.resized = true;

        console.log($scope.size1, $scope.size2, $scope.size3, height, viewport);
    };
    resize();

    $(window).on('resize', resize);
}]);