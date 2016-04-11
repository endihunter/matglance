app.factory('FeedService', ['$http', '$httpParamSerializer', function ($http, $httpParamSerializer) {
    var factory = {};

    factory.news = function (feeds) {
        var args = $httpParamSerializer({
            ids: feeds.join(',')
        });
        return $http.get(app.API_PREFIX + '/feed/news?' + args)
            .then(function (response) {
                return response.data.data;
            });
    };

    return factory;
}]);