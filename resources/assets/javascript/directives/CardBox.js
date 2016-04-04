app.directive('cardBox', function () {
    return {
        'restrict': "E",
        'scope': {
            'title': "@"
        },
        'transclude': {
            'actions': '?cardBoxActions',
            'body': '?cardBoxBody'
        },
        'link': function (scope) {
            scope.editable = false;

            scope.switchEditableMode = function () {
                scope.editable = ! scope.editable;
            }
        },
        'templateUrl': '/assets/templates/card-box.html'
    };
});