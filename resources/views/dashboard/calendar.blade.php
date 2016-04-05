<div ng-controller="CalendarController">
    <card-box title="{{ trans('calendar.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('calendar.settings.title') }}</h5>
            </div>
            <form ng-submit="savePreferences()" novalidate name="form">
                <div class="form-group text-left">
                    Calendars list
                </div>
                <div class="divider"></div>
                <div class="form-group">
                    <button class="btn btn-primary" type="submit" ng-disabled="form.$invalid">Save</button>
                    <button class="btn btn-default" type="button" ng-click="$parent.switchEditableMode()">Cancel</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>
            My agenda here
        </card-box-body>
    </card-box>
</div>