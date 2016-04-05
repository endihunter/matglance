app.directive('cardBox', function () {
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
            scope.hasActions = !! element.find('.dropdown-menu > div[0]').children.length;

            /**
             * Toggle box's preferences
             */
            scope.switchEditableMode = function () {
                scope.editable = ! scope.editable;
            }
        },
        'templateUrl': '/assets/templates/card-box.html'
    };
});