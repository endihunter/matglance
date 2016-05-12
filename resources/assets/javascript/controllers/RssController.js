app.controller('RssController', [
    '$scope', '$timeout', 'localStorageService', 'FeedService',
    function ($scope, $timeout, localStorageService, FeedService) {
        $scope.loading = false;

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
            var hasSavedFeeds = localStorageService.keys().indexOf('feeds') > -1;

            $scope.feeds = [];

            if (! hasSavedFeeds) {
                $scope.feeds = fullList();
            } else {
                savedFeeds = localStorageService.get('feeds');
                if (savedFeeds.length) {
                    $scope.feeds = mapToInt(savedFeeds.split(','));
                }
            }

            $scope.savedFeeds = angular.copy($scope.feeds);

            allChecked();
        }

        function fetchNews() {
            if ($scope.loading || ! $scope.feeds.length)
                return false;

            $scope.loading = true;

            return FeedService.news($scope.feeds).then(function (news) {
                $scope.articles = news;

                $scope.loading = false;
            });
        }

        $scope.allChecked = false;

            // all feeds
        $scope.allFeeds = [];

        // readable feeds
        $scope.feeds = [];

        $scope.savedFeeds = [];

        $scope.articles = [];

        function allChecked () {
            $scope.allChecked = ($scope.feeds.length == $scope.allFeeds.length);
        }

        $scope.$watch('feeds', function (v1, v2) {
            if (v1 === v2) return false;

            allChecked();
        }, true);

        $scope.toggleAll = function ($event) {
            if ($event.target.checked == true) {
                $scope.feeds = fullList();
            } else {
                $scope.feeds = [];
            }
        };

        $scope.init = function (allFeeds) {
            $scope.allFeeds = allFeeds;

            restoreReadableFeeds();

            fetchNews();
        };

        $scope.savePreferences = function (cb) {
            $scope.savedFeeds = mapToInt($scope.feeds);

            localStorageService.set('feeds', $scope.savedFeeds.join(','));

            return fetchNews().then(function () {
                if (cb) {
                    cb();
                }
            });
        };

        $scope.cancel = function (cb) {
            restoreReadableFeeds();

            if (cb) {
                cb();
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