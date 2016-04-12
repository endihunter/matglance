<div ng-controller="QuoteController">
    <card-box title="{{ trans('quote.title') }}" ng-init="quote={{ json_encode($quote) }}">
        <card-box-body>
            <div ng-if="! quote.id">
                {{ trans('quote.not_found') }}
            </div>
            <div ng-if="quote.id">
                <div class="well">
                    @{{ quote.quote }}
                    &nbsp;-&nbsp;
                    <span class="label label-success">@{{ quote.author }}</span>
                </div>
                <hr>
                <button ng-disabled="loading" class="btn btn-info btn-sm" ng-click="fetchRandom()">
                    <i class="zmdi zmdi-refresh-sync"></i>
                    &nbsp;
                    {{ trans('buttons.more') }}
                </button>
            </div>
        </card-box-body>
    </card-box>
</div>