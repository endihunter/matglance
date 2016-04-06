<div ng-controller="RssController">
    <card-box title="{{ trans('rss.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('rss.settings') }}</h5>
            </div>
            <form ng-submit="savePreferences()" novalidate name="form">
                <div class="form-group text-left">
                    Rss feed list
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
        </card-box-body>
    </card-box>
</div>