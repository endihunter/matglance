app.controller('GmailController', ['$scope', 'GmailService', function ($scope, GmailService) {
    $scope.filter = {
        'labelIds': [],
        'q': '',
        'includeSpamTrash': false,
        'maxResults': 5
    };

    $scope.messages = [];

    GmailService.fetchMessages($scope.filter)
        .then(function (messages) {
            $scope.messages = messages;
        })
        .catch(function () {
            console.error(arguments);
        });

    $scope.readMessage = function (id) {
        alert('Coming soon.');
    }
}]);