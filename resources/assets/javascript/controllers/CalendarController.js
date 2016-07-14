app.controller('CalendarController', [
    '$scope', '$rootScope', 'EventsService', 'localStorageService',
    function ($scope, $rootScope, EventsService, localStorageService) {

        $scope.calendars = [];
        $scope.events = [];
        $scope.hasEvents = false;
        $scope.calendarEvents = [];
        
        $scope.init = function init (calendars) {

            $scope.calendars = calendars;
            setDefaultCalendar();

        };

        $scope.savePreferences = function savePreferences (cb) {

            var temp = [];

            for(var i = 0; i < $scope.calendars.length; i++) {
                if($scope.calendars[i].selected == true) {
                    temp.push($scope.calendars[i]);
                }
            }

            localStorageService.set(
                'cal',
                JSON.stringify(angular.copy(temp)));

            fetchEvents();

            if(cb) {
                cb();
            }
        };

        $scope.cancel = function cancel (callback) {
            resetCalendarsStatus();
            setDefaultCalendarsStatus(getSavedCalendars());
            if(callback) {
                callback();
            }
        };

        $scope.select = function (calendar) {
            checkUncheckCalendar(calendar);
        };

        $scope.$on('cardbox.close', function () {
            resetCalendarsStatus();
            setDefaultCalendarsStatus(getSavedCalendars());
        });

        $scope.$watchCollection('calendarEvents', function () {
            $scope.events = [];
            for( var i = 0; i < $scope.calendarEvents.length; i++) {

                for (var a in $scope.calendarEvents[i]) {
                    $scope.events.push($scope.calendarEvents[i][a]);
                }
            }
            if($scope.events.length > 0) {
                $scope.hasEvents = true;
            }
            $scope.events.sort(function (a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a < b ? -1 : a > b ? 1 : 0;
            });
        });

        function setDefaultCalendar() {
            var saved = getSavedCalendars();

            if(!saved || saved == null) {
                $scope.calendars[0].selected = true;
                var temp = [];
                temp.push($scope.calendars[0]);
                localStorageService.set(
                    'cal',
                    JSON.stringify(angular.copy(temp)));
            } else {
                setDefaultCalendarsStatus(saved);
            }

            fetchEvents();
        }

        function checkUncheckCalendar(calendar) {

            for(var i =0; i < $scope.calendars.length; i++) {

                if($scope.calendars[i].id == calendar.id) {

                    // First time loaded
                    if(!$scope.calendars[i].selected || $scope.calendars[i].selected == 'undefined') {
                        $scope.calendars[i].selected = true;
                    } else {  // if user make changed
                        $scope.calendars[i].selected = !$scope.calendars[i].selected;
                    }
                }
            }
        }

        function getSavedCalendars() {
            return JSON.parse(localStorageService.get('cal'));
        }

        function setDefaultCalendarsStatus(calendars) {
            for(var i =0; i < calendars.length; i++) {
                setDefaultCalendarStatus(calendars[i]);
            }
        }

        function setDefaultCalendarStatus(calendar) {
            for( var i = 0; i < $scope.calendars.length; i++) {
                if(calendar.id == $scope.calendars[i].id) {
                    $scope.calendars[i].selected = calendar.selected || false;
                    break;
                }
            }
        }

        function resetCalendarsStatus() {
            for (var i = 0; i <$scope.calendars.length; i++) {
                $scope.calendars[i].selected = false;
            }
        }

        function fetchEvents () {
            $scope.calendarEvents = [];
            $scope.hasEvents = false;
            for (var i = 0; i < $scope.calendars.length; i++) {
                if($scope.calendars[i].selected == true) {
                    EventsService.events($scope.calendars[i].id)
                        .then(function (res) {
                            $scope.calendarEvents.push(res);
                            console.log(res);
                        });
                }
            }
        }
    }]);