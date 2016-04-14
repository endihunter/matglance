app.directive('skycon', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            icon: "@"
        },
        link: function (scope, element, attribs) {
            scope.size = attribs.size || 128;

            var initIcon = function (createNew) {
                var skycons = new Skycons({'color': 'grey'});

                // you can add a canvas by it's ID...
                var draw = attribs.icon.split('-').join('_').toUpperCase();
                if (createNew) {
                    skycons.add('skycon', Skycons[draw]);
                } else {
                    skycons.set('skycon', Skycons[draw]);
                }

                // start animation!
                skycons.play();
            };
            initIcon(false);

            attribs.$observe('icon', initIcon);
        },
        template: '<canvas id="skycon"></canvas>'
    };
});