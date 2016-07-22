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
            $scope.size1 = Math.round(height * 0.34);
            $scope.size2 = Math.round(height * 0.44);
            $scope.size3 = height - ($scope.size1 + $scope.size2);
        } else {
            $scope.size1 = 190;
            $scope.size2 = 230;
            $scope.size3 = 140;
        }

        $scope.resized = true;
    };
    setTimeout(resize, 100);

    $(window).on('resize', resize);
}]);