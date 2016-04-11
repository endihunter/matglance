app.controller('RssController', [
    '$scope', '$timeout', 'localStorageService', 'FeedService',
    function ($scope, $timeout, localStorageService, FeedService) {
        function fullList() {
            return mapToInt(_.pluck($scope.allFeeds, 'id'));
        }

        function mapToInt(values) {
            return values.map(function (value) {
                return parseInt(value);
            });
        }

        function restoreReadableFeeds() {
            var savedFeeds;
            if ((savedFeeds = localStorageService.get('feeds')) && savedFeeds.length) {
                $scope.feeds = mapToInt(savedFeeds.split(','));
            } else {
                $scope.feeds = fullList();
            }
        }

        function fetchNews() {
            FeedService.news($scope.feeds).then(function (news) {
                $scope.articles = news;
            });
        }

        // all feeds
        $scope.allFeeds = [];

        // readable feeds
        $scope.feeds = [];

        $scope.articles = [];

        $scope.init = function (allFeeds) {
            $scope.allFeeds = allFeeds;

            restoreReadableFeeds();

            fetchNews();
        };

        $scope.savePreferences = function () {
            localStorageService.set('feeds', mapToInt($scope.feeds).join(','));

            fetchNews();

            return false;
        };

        $scope.cancel = function (callback) {
            restoreReadableFeeds();

            if (callback) {
                callback();
            }
        };

        $scope.trackUntrack = function (feed_id) {
            feed_id = parseInt(feed_id);

            if ($scope.trackable(feed_id)) {
                $scope.feeds = _.without($scope.feeds, feed_id);
            } else {
                $scope.feeds.push(feed_id);
            }
        };

        $scope.trackable = function (feed_id) {
            feed_id = parseInt(feed_id);

            return _.indexOf($scope.feeds, feed_id) != -1;
        }
    }]);