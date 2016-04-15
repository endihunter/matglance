app.controller('GmailController', ['$scope', 'GmailService', '$sce', 'localStorageService',
    function ($scope, GmailService, $sce, localStorageService) {
        $scope.searchMode = false;

        $scope.message = null;

        $scope.loading = false;

        $scope.nextPageToken = null;

        var emptyFilter = function () {
            return {
                'from': '',
                'to': '',
                'subject': '',
                'includeSpamTrash': false
            };
        };

        var savedFilter;
        if (!(savedFilter = localStorageService.get('g_fltr'))) {
            savedFilter = JSON.stringify(emptyFilter());
            localStorageService.set('g_fltr', savedFilter);
        }

        $scope.filter = JSON.parse(savedFilter);

        $scope.messages = [];

        $scope.query = buildQuery();

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

        $scope.next = $scope.fetchMessages = function () {
            $scope.loading = true;

            // save filter
            localStorageService.set('g_fltr', savedFilter = JSON.stringify($scope.filter));

            var args = {
                'includeSpamTrash': !!$scope.filter.includeSpamTrash,
                'q': buildQuery(),
                'nextPageToken': $scope.nextPageToken
            };

            GmailService.fetchMessages(args)
                .then(function (messages) {
                    // restore listing view
                    angular.safeApply($scope, function ($scope) {
                        for (var i in messages.messages) {
                            $scope.messages.push(messages.messages[i]);
                        }

                        $scope.nextPageToken = messages.nextPage;

                        $scope.loading = false;

                        localStorageService.set('g_msgs', JSON.stringify(messages));
                    });
                })
                .catch(function () {
                    $scope.loading = false;
                });
        };

        // fetch messages on page ready
        $scope.fetchMessages();

        $scope.isUnRead = function (message) {
            return message.hasOwnProperty('labels')
                && (-1 < message.labels.indexOf('UNREAD'));
        };

        $scope.fullMessageUrl = function (messageId) {
            return $sce.trustAsResourceUrl('/gmail/messages/' + messageId + '/body');
        };

        $scope.toggleSearchMode = function (flag, callback) {
            if (!flag) {
                $scope.filter = JSON.parse(savedFilter);
            }

            $scope.searchMode = !!flag;

            if (callback) {
                callback();
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