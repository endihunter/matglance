app.controller('CustomEventController', ['$scope', '$rootScope', '$interval', 'localStorageService', 'CustomEventService',
function ($scope, $rootScope, $interval, localStorageService, CustomEventService) {


    $scope.options = {
        selectedTime: 1
    };
    $rootScope.eventError = {};
    $scope.event = {};
    $scope.timeNow = new Date();
    $scope.loading = true;
    var weekInMilSeconds = 1000 * 60 * 60 * 24 * 7;
    var dayInMilSeconds = 1000 * 60 * 60 * 24;
    var hourInMilSeconds = 1000 * 60 * 60;
    var minuteInMilSeconds = 1000 * 60;
    var secondsInMilSeconds = 1000;


    $scope.setSelectedValue = function (val) {
        return $scope.options.selectedTime = parseInt(val);
    };

    $scope.createEvent = function (callback) {

        $rootScope.eventError = {};
        var date = document.getElementById("datepicker-autoclose").value;
        var title = document.getElementById("event-title").value;
        if($scope.options.selectedTime != 3) {
            var hours = document.getElementById("custom-event-hours").value;
            var minutes = document.getElementById("custom-event-minutes").value;
            var seconds = document.getElementById("custom-event-seconds").value;
        }

        if(date == '' || date == 'undefined') {
            $rootScope.eventError.eventDate = 'Please set an event date!';
        }

        if(title == '' || title == 'undefined') {
            $rootScope.eventError.eventTitle = 'Please set an event title!';
        }

        var dateToArr = transformDate(date);

        var autoGenerated = false;
        if(!hours && !minutes && !seconds) {
            autoGenerated = true;
        }
        if($scope.options.selectedTime == 3) {
            hours = 23;
            minutes = 59;
            seconds = 59;
            autoGenerated = true;
        }

        var tempDate = new Date(dateToArr[2] + '-' + dateToArr[1] + '-' + dateToArr[0]);
        if(hours) {
            tempDate.setHours(parseInt(hours));
        } else {
            tempDate.setHours(0);
        }
        if(minutes) {
            tempDate.setMinutes(parseInt(minutes));
        } else {
            tempDate.setMinutes(0);
        }
        if(seconds) {
            tempDate.setSeconds(parseInt(seconds));
        } else {
            tempDate.setSeconds(0);
        }
        


        if(tempDate < new Date()) {
            $rootScope.eventError.invalidTime = 'Event time must be in the future';
        }

        if(Object.keys($rootScope.eventError).length > 0) {
            return;
        }

        var data = {
            date: date,
            minutes: minutes || null,
            hours: hours || null,
            seconds: seconds || null,
            title: title,
            time_option: $scope.options.selectedTime,
            autoGenerated: autoGenerated
        };

        if($scope.event != null) {

            data.id = $scope.event.id;
            CustomEventService.updateEvent(data)
                .then(function (res) {
                    fetchEvent();
                    if(callback) {
                        callback();
                    }
                });
        } else {
            CustomEventService.createEvent(data)
                .then(function (res) {
                    fetchEvent();
                    if(callback) {
                        callback();
                    }
                });
        }
    };

    $scope.cancel = function (callback) {
        if(callback) {
            callback();
        }
        $rootScope.eventError = {};
    };

    function transformDate(arg) {
        return arg.split('.');
    }

    function fetchEvent() {
        $scope.loading = true;
        CustomEventService.getEvent()
            .then(function (res) {
                handleEvent(res);
                watchClockInterval();
            })
    }
    function parseDateTimeForIE(str) {

        var dateAndTimeArr = str.split(' ');
        var dateToArr = dateAndTimeArr[0].split('-');
        var timeToArr = dateAndTimeArr[1].split(':');

        return new Date(dateToArr[0], dateToArr[1] - 1, dateToArr[2], timeToArr[0], timeToArr[1], timeToArr[2]);
    }

    function handleEvent(res) {
        if(res == 'No event created yet') {
            $scope.event = null;
            return;
        } else if(new Date(res.time) < new Date() ) {
            $scope.event = null;
            return;
        }
        $scope.event = res;
        $scope.event.time = parseDateTimeForIE($scope.event.time);
        $scope.options.selectedTime = parseInt(res.time_option);
        $scope.loading = false;
        $scope.eventTimeToString = eventTimeToString($scope.event.time);
        $scope.eventDateToString = eventDateToString($scope.event.time);
        calculateTime($scope.event.time, $scope.options.selectedTime);
    }

    var watchClockInterval = function () {
        $interval(function () {
            if($scope.event == null) {
                $interval.cancel(watchClockInterval);
                return;
            }
            if (new Date($scope.event.time) < new Date()) {
                return $scope.event = null;
            }
            calculateTime($scope.event.time, $scope.options.selectedTime);
        }, 1000);
    };

    function calculateTime(time, timeOption) {

        var timeToEvent = time - new Date();
        switch (timeOption) {
            case 1:
                var weeks = getWeeksAndRest(timeToEvent);
                var days = getDaysAndRest(weeks.rest);
                var hours = getHoursAndRest(days.rest);
                var minutes = getMinutesAndRest(hours.rest);
                var seconds = getSeconds(minutes.rest);
                generateTimeStringOutput(weeks.weeks, days.days, hours.hours, minutes.minutes, seconds.seconds, timeOption);
                break;
            case 2:
                var days = getDaysAndRest(timeToEvent);
                var hours = getHoursAndRest(days.rest);
                minutes = getMinutesAndRest(hours.rest);
                var seconds = getSeconds(minutes.rest);
                generateTimeStringOutput(null, days.days, hours.hours, minutes.minutes, seconds.seconds, timeOption);
                break;
            case  3:
                var days = getDaysAndRest(timeToEvent);
                generateTimeStringOutput(null, days.days, null, null, null, timeOption);
                break;
            default:
                break;
        }
    }

    $scope.$watch('options.selectedTime', function (newVal, oldVal ) {
        if($scope.loading == true) {
            return;
        }
        calculateTime($scope.event.time, $scope.options.selectedTime);
    });

    function getWeeksAndRest(time) {
        return {
            weeks: parseInt(new Date(time).getTime() / weekInMilSeconds),
            rest: new Date(time).getTime() % weekInMilSeconds
        }
    }

    function getDaysAndRest(time) {
        return {
            days: parseInt(new Date(time).getTime() / dayInMilSeconds),
            rest: new Date(time).getTime() % dayInMilSeconds
        }
    }

    function getHoursAndRest(time) {
        return {
            hours: parseInt(new Date(time).getTime() / hourInMilSeconds),
            rest: new Date(time).getTime() % hourInMilSeconds
        }
    }

    function getMinutesAndRest(time) {
        return {
            minutes: parseInt(new Date(time).getTime() / minuteInMilSeconds),
            rest: new Date(time).getTime() % minuteInMilSeconds
        }
    }

    function getSeconds(time) {
        return {
            seconds: parseInt(new Date(time).getTime() / secondsInMilSeconds)
        }
    }

    function generateTimeStringOutput(weeks, days, hours, minutes, seconds, timeOption) {
        switch (timeOption) {
            case 1:
                var weeksStr = weeks == 1 ? weeks + ' week ' : weeks + ' weeks ';
                var daysStr = days == 1 ? days + ' day ' : days + ' days ';
                var hoursStr = hours == 1 ? hours + ' hour ' : hours + ' hours ';
                var minutesStr = minutes == 1 ? minutes + ' minute ' : minutes + ' minutes ';
                var secondsStr = seconds == 1 ? seconds + ' second ' : seconds + ' seconds ';
                $scope.timeLeftToString = 'In ' + weeksStr + daysStr + hoursStr + minutesStr + secondsStr;
                break;
            case 2:
                var daysStr = days == 1 ? days + ' day ' : days + ' days ';
                var hoursStr = hours == 1 ? hours + ' hour ' : hours + ' hours ';
                var minutesStr = minutes == 1 ? minutes + ' minute ' : minutes + ' minutes ';
                var secondsStr = seconds == 1 ? seconds + ' second ' : seconds + ' seconds ';
                $scope.timeLeftToString = 'In ' + daysStr + hoursStr + minutesStr + secondsStr;
                break;
            case 3:
                var daysStr = days == 1 ? days + ' day ' : days + ' days ';
                $scope.timeLeftToString = 'In ' + daysStr;
                break;
            default:
                break;
        }
    }
    function eventTimeToString(time) {
        var year = time.getFullYear();
        var date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        var month = time.getMonth() < 10 + 1? '0' + (time.getMonth() +1): time.getMonth() + 1;
        var hour = time.getHours() < 10 ? '0' + time.getHours(): time.getHours();
        var minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        if($scope.event.autoGenerated == true || $scope.event.autoGenerated == 1) {
            var output = date + '.' + month + '.' + year;
        } else if($scope.options.selectedTime == 3){
            var output = date + '.' + month + '.' + year;
        } else {
            var output = date + '.' + month + '.' + year + ', ' + hour + ':' + minutes;
        }

        return output;
    }

    function eventDateToString(time) {
        var year = time.getFullYear();
        var date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        var month = time.getMonth() < 10 + 1? '0' + (time.getMonth() +1): time.getMonth() + 1;
        var output = date + '.' + month + '.' + year;

        return output;
    }
    fetchEvent();
}]);