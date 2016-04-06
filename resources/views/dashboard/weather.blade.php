<div ng-controller="WeatherController">
    <card-box title="{{ trans('weather.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('weather.settings') }}</h5>
            </div>
            <form ng-submit="savePreferences()" novalidate name="form">
                <div class="form-group text-left">
                    <p class="text-muted font-13 m-b-15 m-t-20">{{ trans('weather.units') }}</p>
                    <div class="radio radio-info radio-inline">
                        <input type="radio" required id="celsius" value="celsius" ng-model="data.units">
                        <label for="celsius">{{ trans('weather.celsius') }}</label>
                    </div>
                    <div class="radio radio-info radio-inline">
                        <input type="radio" required id="fahrenheit" value="fahrenheit" ng-model="data.units">
                        <label for="fahrenheit">{{ trans('weather.fahrenheit') }}</label>
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" required class="form-control" placeholder="Location" ng-model="data.location"/>
                </div>
                <div class="divider"></div>
                <div class="form-group">
                    <button class="btn btn-primary" type="submit" ng-disabled="form.$invalid">{{ trans('buttons.save') }}</button>
                    <button class="btn btn-default" type="button" ng-click="$parent.switchEditableMode()">{{ trans('buttons.cancel') }}</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>
            Panel content
            <div>
                @{{ data.location }}
            </div>
        </card-box-body>
    </card-box>
</div>