<div ng-controller="WeatherController">
    <card-box title="{{ trans('weather.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('weather.settings') }}</h5>
            </div>
            <form ng-submit="savePreferences($parent.switchEditableMode);" novalidate name="form">
                <div class="form-group text-left">
                    <p class="text-muted font-13 m-b-15 m-t-20">{{ trans('weather.units') }}</p>
                    <div class="radio radio-info radio-inline">
                        <input type="radio" required id="celsius" value="si" ng-model="filter.units">
                        <label for="celsius">{{ trans('weather.celsius') }}</label>
                    </div>
                    <div class="radio radio-info radio-inline">
                        <input type="radio" required id="fahrenheit" value="us" ng-model="filter.units">
                        <label for="fahrenheit">{{ trans('weather.fahrenheit') }}</label>
                    </div>
                </div>
                <div class="btn-group">
                    <input type="text" required class="form-control" placeholder="{{ trans('weather.location') }}" ng-model="filter.address"/>

                    <ul style="position: absolute;" id="cities-list" class="dropdown-menu demo-dropdown" role="menu" ng-if="cities.length">
                        <li ng-repeat="city in cities">
                            <a ng-click="selectCity(city)">@{{ city.description }}</a>
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
            <div style="height: 300px;">
                <div class="row" ng-show="weather && weather.timezone">
                    <div class="col-lg-5 col-md-5 col-sm-6" style="margin-bottom: 32px;">
                        <ul class="list-unstyled">
                            <li>
                                <h2 class="text-primary">@{{ weather.currently.summary }}</h2>
                                <div class="clearfix"></div>
                            </li>
                            <li>
                                <h4 class="text-muted">@{{ locationToCity(weather.address) }}</h4>
                                <span class="label label-info">@{{ weather.currently.time }}</span>
                            </li>
                            <li>
                                {{ trans('weather.wind') }}: @{{ weather.currently.windSpeed }} @{{ (filter.units == 'us' ? 'm/h' : 'm/s') }}
                            </li>
                            <li>
                                {{ trans('weather.precip_probability') }}: @{{ weather.currently.precipProbability }}%
                            </li>
                            <li>
                                {{ trans('weather.pressure') }}: @{{ weather.currently.pressure }} hPa
                            </li>
                            <li>
                                {{ trans('weather.humidity') }}: @{{ weather.currently.humidity }}%
                            </li>
                            <li>
                                {{ trans('weather.cloudiness') }}: @{{ weather.currently.cloudCover }}%
                            </li>
                        </ul>
                    </div>
                    <div class="col-lg-7 col-md-7 col-sm-6 text-left">
                        <skycon icon="@{{ weather.currently.icon }}" width="128" height="128"></skycon>

                        <h1 class="text-primary">@{{ weather.currently.temperature }} @{{ (filter.units == 'us' ? '&deg;F' : "&deg;C") }}</h1>
                    </div>
                </div>
            </div>
        </card-box-body>
    </card-box>
</div>