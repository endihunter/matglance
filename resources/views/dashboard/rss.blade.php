<div ng-controller="RssController" ng-init="init({{ json_encode($feeds) }})">
    <card-box title="{{ trans('rss.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('rss.settings') }}</h5>
            </div>
            <form ng-submit="savePreferences($parent.switchEditableMode)" novalidate name="form">
                <div class="btn-group">
                    <ul class="list-unstyled" role="menu">
                        <li ng-repeat="feed in allFeeds">
                            <label>
                                <input type="checkbox" ng-click="trackUntrack(feed.id)" ng-checked="trackable(feed.id)">&nbsp;
                                @{{ feed.name }}
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="divider"></div>
                <div class="form-group">
                    <button class="btn btn-primary" type="submit" ng-disabled="form.$invalid">{{ trans('buttons.save') }}</button>
                    <button class="btn btn-default" type="button" ng-click="cancel($parent.switchEditableMode)">{{ trans('buttons.cancel') }}</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>
            <div style="overflow-y: auto; height:300px;">
                <div class="widget-user">
                    <a ng-href="@{{ article.link }}" target="_blank" ng-repeat="article in articles" style="margin-bottom: 10px; display: block; cursor: pointer">
                        <img ng-if="article.media" ng-src="@{{ article.media.url }}" style="width: 75px; height: auto;" alt="user">
                        <div ng-class="{'wid-u-info': article.media}">
                            <strong class="m-t-0 m-b-5 font-600">@{{ article.title }}</strong>
                            <p class="text-muted m-b-5 font-13">@{{ article.content }}</p>
                            <small class="text-warning"><b>@{{ article.pubDate }}</b></small>
                        </div>
                    </a>
                </div>
            </div>
        </card-box-body>
    </card-box>
</div>