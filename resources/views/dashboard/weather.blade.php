<div ng-controller="WeatherController">
    <card-box title="{{ trans('weather.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5 >{{ trans('weather.settings') }}</h5>
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
                    <button class="btn btn-primary" type="submit">{{ trans('buttons.save') }}</button>
                    <button class="btn btn-default" type="button" ng-click="cancel($parent.switchEditableMode)">{{ trans('buttons.cancel') }}</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>
            <div ng-style="{'height': size1 + 'px'}">
                <div class="row p-l-r-10" ng-show="weather && weather.timezone">
                    <div class="col-lg-6 col-md-6 col-sm-6">
                    {{--<div class="col-lg-12 col-md-12 col-sm-12">--}}
                        <ul class="list-unstyled weather-info-panel">
                            <li>
                                <h4 style="line-height:0;" class="text-primary">@{{ weather.currently.summary }}</h4>
                                <div class="clearfix"></div>
                            </li>
                            <li>
                                <h5 class="text-muted">@{{ locationToCity(weather.address) }}</h5>
                                {{--<span class="label label-info">@{{ weather.currently.time }}</span>--}}
                            </li>
                            {{--<li>--}}
                                {{--<strong>@{{ weather.currently.temperature }} @{{ (filter.units == 'us' ? '&deg;F' : "&deg;C") }}</strong>--}}
                            {{--</li>--}}
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
                    <div class="col-lg-6 col-md-6 col-sm-6 text-left">
                        <img ng-if="weather.currently.icon" ng-src="@{{ icon() }}" width="100" height="100" alt="">

                        <h1 class="text-primary">@{{ weather.currently.temperature }} @{{ (filter.units == 'us' ? '&deg;F' : "&deg;C") }}</h1>
                    </div>
                </div>
            </div>
        </card-box-body>
    </card-box>
</div>