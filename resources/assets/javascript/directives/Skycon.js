app.directive('skycon', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            icon: "@"
        },
        link: function (scope, element, attribs) {
            scope.size = attribs.size || 128;

            var initIcon = function () {
                if (! attribs.icon) return false;

                var skycons = new Skycons({'color': 'grey'});

                skycons.remove("skycon");

                // you can add a canvas by it's ID...
                var draw = attribs.icon.split('-').join('_').toUpperCase();

                skycons.add('skycon', Skycons[draw]);

                // start animation!
                //skycons.play();
            };

            attribs.$observe('icon', initIcon);
        },
        template: '<canvas id="skycon"></canvas>'
    };
});