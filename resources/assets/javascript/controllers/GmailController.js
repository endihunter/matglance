app.controller('GmailController', ['$scope', 'GmailService', function ($scope, GmailService) {
    $scope.searchMode = false;

    $scope.message = null;

    $scope.loading = false;

    $scope.filter = {
        'from': '',
        'to': '',
        'subject': '',
        'includeSpamTrash': false
    };

    $scope.messages = [];

    $scope.query = '';

    function buildQuery() {
        $scope.query = '';

        var q = [];
        angular.forEach(['from', 'to', 'subject'], function (field, index, values) {
            var value = $scope.filter[field];

            if (value.length) {
                q.push(field + ': (' + value + ')');
            }
        });

        $scope.query = q.join(" ").trim();

        return $scope.query;
    }


    $scope.fetchMessages = function () {
        $scope.loading = true;

        var args = {
            'includeSpamTrash': !!$scope.includeSpamTrash,
            'q': buildQuery()
        };

        GmailService.fetchMessages(args)
            .then(function (messages) {
                angular.safeApply($scope, function ($scope) {
                    $scope.messages = messages;

                    $scope.loading = false;
                });
            })
            .catch(function () {
                console.error(arguments);
                $scope.loading = false;
            });
    };

    // fetch messages on page ready
    $scope.fetchMessages();

    $scope.isUnRead = function (message) {
        return message.hasOwnProperty('labels')
            && (-1 < message.labels.indexOf('UNREAD'));
    };

    $scope.toggleSearchMode = function () {
        $scope.searchMode = !$scope.searchMode;

        if (!$scope.searchMode) {
            $scope.switchEditableMode();
        }
    };

    $scope.backToList = function () {
        $scope.message = null;
    };

    $scope.readMessage = function (messageId) {
        $scope.loading = true;

        GmailService.get(messageId)
            .then(function (message) {
                angular.safeApply($scope, function ($scope) {
                    $scope.message = message;

                    $scope.loading = false;

                    var currentMessage = $scope.messages.filter(function (message) {
                        return message.id == messageId;
                    })[0];

                    $scope.messages.map(function (message) {
                        if (message.id == messageId && $scope.isUnRead(message)) {
                            var index = message.labels.indexOf('UNREAD');

                            message.labels.splice(index, 1);

                            GmailService.markAsRead(messageId);
                        }

                        return message;
                    });
                });
            })
            .catch(function () {
                console.log(arguments);

                $scope.loading = false;
            });
    }
}]);