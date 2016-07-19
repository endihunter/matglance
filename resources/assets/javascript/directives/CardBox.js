app.directive('cardBox', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
    return {
        'restrict': "E",
        'scope': {
            'title': "@"
        },
        'transclude': {
            'actions': '?cardBoxActions',
            'body': 'cardBoxBody'
        },
        'link': function (scope, element) {
            scope.editable = false;

            /**
             * toggle the actions button if no actions content provided
             * @type {boolean}
             */
            $timeout(function () {
                scope.hasActions = !!element.find('card-box-actions').text().length;
            });

            /**
             * Toggle box's preferences
             */
            scope.switchEditableMode = function (callback) {
                scope.editable = !scope.editable;

                if (callback) {
                    callback();
                }
            };

            function close() {

                $rootScope.eventError = {};
                $rootScope.rssValidLink = true;
                var datePickerOpen = document.getElementsByClassName("datepicker");
                if(datePickerOpen.length > 0) {
                    return;
                }
                angular.safeApply(scope, function (scope) {
                    scope.editable = false;
                });
            }

            scope.close = close;

            $rootScope.$on('cardbox.close', close);
        },
        'templateUrl': app.REWRITE_BASE + 'assets/templates/card-box.html'
    };
}]);