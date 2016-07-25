<div ng-controller="RssController" ng-init="init({{ json_encode($feeds) }})">
    <card-box title="{{ trans('rss.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('rss.settings') }}</h5>
            </div>
            <form ng-submit="savePreferences($parent.switchEditableMode)" novalidate name="form">
                <div class="btn-group">
                    <ul class="list-unstyled" role="menu">
                        <li>
                            <label>
                                <input type="checkbox" ng-click="toggleAll($event)" ng-checked="allChecked">
                                {{ trans('rss.toggle') }}
                            </label>
                        </li>
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
                    <button class="btn btn-primary" type="submit">{{ trans('buttons.save') }}</button>
                    <button class="btn btn-default" type="button" ng-click="cancel($parent.switchEditableMode)">{{ trans('buttons.cancel') }}</button>
                </div>
            </form>
            <form ng-submit="addCustomRSSFeed(customFeedUrl, rssName)">
                <div class="form-group" ng-class="(rssValidLink == false) ? 'has-error has-feedback' : ''">
                    <input type="text" ng-model="customFeedUrl" placeholder="RSS Link" class="form-control" id="rss_url">
                    <div ng-if="rssValidLink == false">
                        <small class="text-danger">{{ trans('rss.invalid_link') }}</small>
                    </div>
                </div>
                <div class="form-group" ng-class="(rssValidName == false) ? 'has-error has-feedback' : ''">
                    <input type="text" ng-model="rssName" placeholder="RSS name" class="form-control" id="rss_name">
                    <div ng-if="rssValidName == false">
                        <small class="text-danger">{{ trans('rss.invalid_name') }}</small>
                    </div>
                </div>

                <div>
                    <button type="submit" class="btn btn-custom">{{ trans('rss.add') }}</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>
            <div style="overflow-y: auto;" ng-style="{'height': size1 + 'px'}">
                <div class="widget-user" ng-if="savedFeeds.length">
                    <a ng-href="@{{ article.link }}" target="_blank" ng-repeat="article in articles" style="display: block; cursor: pointer">
                        <div class="m-b-15">
                            {{--<img ng-if="article.media == null && article.enclosure == null"src="images/noimage.png" style="width: 75px; height: auto; border: 1px solid #BFBFBF; margin-right: 15px;" alt="user">--}}
                            <img ng-if="article.media" ng-src="@{{ article.media.url }}" style="width: 75px; height: auto;" alt="user">
                            <img ng-if="article.media == null && article.enclosure.url" ng-src="@{{ article.enclosure.url }}" style="width: 75px; height: auto;" alt="user">
                            <div ng-class="{'wid-u-info': article.media}">
                                <strong class="m-t-0 m-b-5 font-600">@{{ article.title }}</strong>
                                <small class="text-default m-r-10 pull-right">@{{ article.pubDate.date | date: 'dd.MM.yyyy , HH:mm'}}</small>
                                <p class="text-muted m-b-5 font-13 rss-article-content">@{{ article.content }}</p>
                            </div>
                            <div style="height: 0px; clear: both; float: none;"></div>
                        </div>
                    </a>
                </div>

                <div class="widget-user" ng-if="!savedFeeds.length">
                    {{ trans('rss.no_feeds') }}
                </div>
            </div>
        </card-box-body>
    </card-box>
</div>