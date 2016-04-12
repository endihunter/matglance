<div ng-controller="CalendarController" ng-init="init({{ json_encode($calendars) }})">
    <card-box title="{{ trans('calendar.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('calendar.title') }}</h5>
            </div>
            <form ng-submit="savePreferences()" novalidate name="form">
                <div class="btn-group">
                    <ul class="list-unstyled">
                        <li ng-repeat="cal in calendars">
                            <label>
                                <input type="radio" name="calendar" ng-click="select(cal)" ng-checked="selected(cal)">&nbsp;
                                @{{ cal.summary }}
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="divider"></div>
                <div class="form-group">
                    <button class="btn btn-primary" type="submit" ng-disabled="loading">{{ trans('buttons.save') }}</button>
                    <button class="btn btn-default" type="button" ng-disabled="loading" ng-click="cancel($parent.switchEditableMode)">{{ trans('buttons.cancel') }}</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>
            <table class="table">
                <tr ng-if="! events.length">
                    <td colspan="3">
                        {{ trans('calendar.no_events') }}
                    </td>
                </tr>
                <tr ng-repeat="event in events">
                    <td class="text-primary">
                        @{{ event.start.formattedDate }}
                    </td>
                    <td>

                        <span ng-if="event.allDay">{{ trans('calendar.all_day') }}</span>
                        <span ng-if="! event.allDay">
                            @{{ event.start.time }} - @{{ event.end.time }}
                        </span>
                    </td>
                    <td>
                        <event-icon event="@{{ event }}"></event-icon>
                        <a ng-href="@{{ event.link }}" target="_blank">@{{ event.summary }}</a>
                    </td>
                </tr>
            </table>
        </card-box-body>
    </card-box>
</div>