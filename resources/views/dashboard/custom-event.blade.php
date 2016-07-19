<div ng-controller="CustomEventController">
    <card-box title="{{ trans('customEvent.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('customEvent.settings') }}</h5>
            </div>
            <form ng-submit="createEvent($parent.switchEditableMode, eventTitle, hours, minutes, seconds)">
                <div class="input-group events-full-width-inputs" ng-class="eventError.eventTitle ? 'has-error has-feedback' : ''">
                    <input type="text" class="form-control" placeholder=" {{ trans('customEvent.name') }} " ng-model="eventTitle" ng-change="eventError.eventTitle = ''">
                    <div ng-if="eventError.eventTitle"><span>
                            <small class="text-danger">@{{ error.eventTitle }}</small>
                        </span>
                    </div>
                </div>
                <div class="input-group events-full-width-inputs" ng-class="eventError.eventDate ? 'has-error has-feedback' : ''">
                    <input type="text" class="form-control" placeholder="dd/mm/yyyy" id="datepicker-autoclose" data-provide="datepicker" ng-model="date">
                    <div ng-if="eventError.eventDate"><span>
                            <small class="text-danger">@{{ error.eventDate }}</small>
                        </span>
                    </div>
                </div>
                <div class="input-group events-hh-mm-ss-inputs" ng-if="options.selectedTime != 3">
                    <input type="number" class="form-control" placeholder="hh" id="custom-event-hours" min="0" max="24">
                    <input type="number" class="form-control" placeholder="mm" id="custom-event-minutes" min="0" max="60">
                    <input type="number" class="form-control" placeholder="ss" id="custom-event-seconds" min="0" max="60">
                </div>

                <div class="radio">
                    <input type="radio" name="radio" id="radio1" ng-click="setSelectedValue(1)" ng-checked="options.selectedTime == 1">
                    <label for="radio1">
                        {{ trans('customEvent.selectedOne') }}
                    </label>
                </div>
                <div class="radio">
                    <input type="radio" name="radio" id="radio2" ng-click="setSelectedValue(2)" ng-checked="options.selectedTime == 2">
                    <label for="radio2">
                        {{ trans('customEvent.selectedTwo') }}
                    </label>
                </div>
                <div class="radio">
                    <input type="radio" name="radio" id="radio3"  ng-click="setSelectedValue(3)" ng-checked="options.selectedTime == 3">
                    <label for="radio3">
                        {{ trans('customEvent.selectedTree') }}
                    </label>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" type="submit">Save</button>
                    <button class="btn btn-default" type="button" ng-click="cancel($parent.switchEditableMode)">Cancel</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>
            <div style="overflow-y: auto;" ng-style="{'height': size3 + 'px'}">
                <h4 class="text-dark text-center"><strong>@{{ event.title }}</strong></h4>
                <p class="text-center">@{{ event.time | date:'dd.MM.yyyy' }}, @{{ event.time | date:'HH:mm' }}</p>
                <p ng-if="loading == false" class="text-center">
                    <strong>In </strong>
                    <strong countdown end-date="@{{ stringTime }}" units="weeks|days|hours|minutes|seconds" ng-if="options.selectedTime == 1"></strong>
                    <strong countdown end-date="@{{ stringTime }}" units="days|hours|minutes|seconds" ng-if="options.selectedTime == 2"></strong>
                    <strong countdown end-date="@{{ stringTime }}" units="days" ng-if="options.selectedTime == 3"></strong>
                </p>
            </div>
        </card-box-body>
    </card-box>
</div>