app.factory('GmailService', ['$http', function ($http) {
    var factory = {};

    factory.fetchMessages = function (filter) {
        return $http.get(app.API_PREFIX + '/gmail/messages', filter)
            .then(function (response) {
                return response.data.data;
            });
    };

    return factory;
}]);