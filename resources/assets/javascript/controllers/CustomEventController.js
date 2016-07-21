app.controller('CustomEventController', ['$scope', '$rootScope', 'localStorageService', 'CustomEventService', function ($scope, $rootScope, localStorageService, CustomEventService) {


    $scope.eventTitle = '';

    $scope.options = {
        selectedTime: 1
    };
    $rootScope.eventError = {};
    $scope.event = {};
    $scope.timeNow = new Date();
    $scope.loading = true;
    $scope.setSelectedValue = function (val) {
        return $scope.options.selectedTime = parseInt(val);
    };

    $scope.createEvent = function (callback, title) {

        $rootScope.eventError = {};
        var date = document.getElementById("datepicker-autoclose").value;
        if($scope.options.selectedTime != 3) {
            var hours = document.getElementById("custom-event-hours").value;
            var minutes = document.getElementById("custom-event-minutes").value;
            var seconds = document.getElementById("custom-event-seconds").value;
        }

        if(date == '' || date == 'undefined') {
            $rootScope.eventError.eventDate = 'Please set a event date!';
        }
        if(title == '' || title == 'undefined') {
            $rootScope.eventError.eventTitle = 'Please set a event title!';
        }

        if($scope.options.selectedTime == 3) {
            hours = 23;
            minutes = 59;
            seconds = 59;
        }

        var dateToArr = transformDate(date);

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
            time_option: $scope.options.selectedTime
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
    
    $scope.cancel = function (callback) {;
        if(callback) {
            callback();
        }
    };

    function transformDate(arg) {
        return arg.split('.');
    }

    function fetchEvent() {
        CustomEventService.getEvent()
            .then(function (res) {
                handleEvent(res);
            })
    }

    function handleEvent(res) {
        if(res == 'No event created yet') {
            $scope.event = null;
            return;
        }
        $scope.event = res;
        $scope.event.time = new Date($scope.event.time);
        $scope.options.selectedTime = parseInt(res.time_option);
        $scope.stringTime = $scope.event.time.toString();
        $scope.loading = false;
    }

    fetchEvent();
}]);