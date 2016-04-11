app.controller('CalendarController', [
    '$scope', 'EventsService', 'localStorageService',
    function ($scope, EventsService, localStorageService) {
        $scope.loading = false;

        $scope.filter = {
            calendar: null
        };

        $scope.calendars = [];

        $scope.events = [];

        function select(cal) {
            $scope.filter.calendar = angular.copy(cal);
        }

        function selectDefaultCalendar() {
            if (!$scope.filter.calendar) {
                var calendar = $scope.calendars.filter(function (c) {
                    return 'true' == c.primary;
                })[0];

                console.log('primary', calendar);

                select(calendar);
            }
        }

        function fetchEvents() {
            $scope.loading = true;
            EventsService.events($scope.filter.calendar.id)
                .then(function (events) {
                    $scope.events = events;
                    $scope.loading = false;
                });
        }

        $scope.init = function (calendars) {
            $scope.calendars = calendars;

            var savedCalendar;
            if (savedCalendar = localStorageService.get('cal')) {
                savedCalendar = JSON.parse(savedCalendar);
                console.log('saved', savedCalendar);
                $scope.filter.calendar = savedCalendar;
            }

            selectDefaultCalendar();

            fetchEvents();
        };

        $scope.savePreferences = function () {
            localStorageService.set(
                'cal',
                JSON.stringify(angular.copy($scope.filter.calendar))
            );

            fetchEvents();
        };

        $scope.select = function (cal) {
            $scope.filter.calendar = angular.copy(cal);
            console.log('selected', $scope.filter.calendar);
        };

        $scope.selected = function (cal) {
            return ($scope.filter.calendar && $scope.filter.calendar.id == cal.id);
        };

        $scope.cancel = function (callback) {
            $scope.filter.calendar = angular.copy(
                JSON.parse(localStorageService.get('cal'))
            );

            if (callback) {
                callback();
            }
        };
    }]);