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

        // console.log({
        //     s1: $scope.size1,
        //     s2: $scope.size2,
        //     s3: $scope.size3,
        //     h: height,
        //     v: viewport
        // });
    };
    setTimeout(resize, 100);

    $(window).on('resize', resize);
}]);