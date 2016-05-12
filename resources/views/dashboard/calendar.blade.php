<div ng-controller="CalendarController" ng-init="init({{ json_encode($calendars) }})">
    <card-box title="{{ trans('calendar.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('calendar.title') }}</h5>
            </div>
            <form ng-submit="savePreferences($parent.switchEditableMode)" novalidate name="form">
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
                    <button class="btn btn-primary" type="submit">{{ trans('buttons.save') }}</button>
                    <button class="btn btn-default" type="button" ng-click="cancel($parent.switchEditableMode)">{{ trans('buttons.cancel') }}</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>
            <div style="height: @{{ size2 }}px; overflow-y: auto;">
                <table class="table">
                    <tr ng-if="! hasEvents">
                        <td colspan="2">
                            {{ trans('calendar.no_events') }}
                        </td>
                    </tr>
                    <tr ng-repeat="(time, object) in events">
                        <td class="text-primary">
                            @{{ object.date }}
                        </td>
                        <td>
                            <ul class="list-unstyled">
                                <li ng-repeat="event in object.events">
                                    <event-icon event="@{{ event }}"></event-icon>
                                    <span ng-if="event.allDay">{{ trans('calendar.all_day') }}</span>
                                    <span ng-if="! event.allDay">
                                        @{{ event.start.time }} - @{{ event.end.time }}
                                    </span>
                                    &nbsp;
                                    <a ng-href="@{{ event.link }}" target="_blank">@{{ event.summary }}</a>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </div>
        </card-box-body>
    </card-box>
</div>