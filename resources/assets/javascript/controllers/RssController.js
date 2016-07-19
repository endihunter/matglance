app.controller('RssController', [
    '$scope', '$timeout', '$rootScope', 'localStorageService', 'FeedService', '$q',
    function ($scope, $timeout, $rootScope, localStorageService, FeedService, $q) {
        $scope.loading = false;


        function key(path) {
            return window['lang'] + '.' + path;
        }

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
            var hasSavedFeeds = localStorageService.keys().indexOf(key('feeds')) > -1;

            $feeds = [];

            if (!hasSavedFeeds) {
                $feeds = fullList();
            } else {
                savedFeeds = localStorageService.get(key('feeds'));
                if (savedFeeds.length) {
                    $feeds = mapToInt(savedFeeds.split(','));
                }
            }

            $scope.savedFeeds = angular.copy($feeds);

            allChecked();
        }

        function fetchNews() {
            var defer = $q.defer();

            if ($scope.loading || !$feeds.length) {
                defer.resolve([]);
            } else {
                $scope.loading = true;

                FeedService.news($feeds).then(function (news) {
                    $scope.loading = false;
                    $scope.articles = news;
                    defer.resolve(news);
                });
            }
            return defer.promise;
        }

        $scope.allChecked = false;

        // all feeds
        $scope.allFeeds = [];

        // readable feeds
        var $feeds = [];

        $scope.savedFeeds = [];

        $scope.articles = [];


        function allChecked() {
            $scope.allChecked = ($feeds.length == $scope.allFeeds.length);
        }

        $scope.$watch('feeds', function (v1, v2) {
            if (v1 === v2) return false;

            allChecked();
        }, true);

        $scope.toggleAll = function ($event) {
            if ($event.target.checked == true) {
                $feeds = fullList();
            } else {
                $feeds = [];
            }
        };

        $scope.init = function (allFeeds) {
            $scope.allFeeds = allFeeds;
            restoreReadableFeeds();

            fetchNews();
        };

        $scope.savePreferences = function (cb) {
            $scope.savedFeeds = mapToInt($feeds);

            localStorageService.set(key('feeds'), $scope.savedFeeds.join(','));

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
                $feeds = _.without($feeds, feed_id);
            } else {
                $feeds.push(feed_id);
            }
        };

        $scope.trackable = function (feed_id) {
            feed_id = parseInt(feed_id);

            return _.indexOf($feeds, feed_id) != -1;
        };

        $scope.customFeedUrl = '';
        $rootScope.rssValidLink = true;

        $scope.addCustomRSSFeed = function (url, name) {
            $rootScope.rssValidLink = true;
            $rootScope.rssValidName = true;
            var data = {
                url: url,
                name: name
            };
            if(!url || url == 'undefined') {
                $rootScope.rssValidLink = false;
            }
            if(!name || name == 'undefined') {
                $rootScope.rssValidName = false;
            }
            if($rootScope.rssValidLink == false || $rootScope.rssValidName == false) {
                return;
            }
            FeedService.createCustomFeed(data)
                .then(function (res) {
                    $scope.customFeedUrl = '';
                    $scope.rssName = '';
                    $scope.allFeeds.push({id: res.id, name: res.name});
                }, function (err) {
                    $rootScope.rssValidLink = false;
                })
        };

    }]);