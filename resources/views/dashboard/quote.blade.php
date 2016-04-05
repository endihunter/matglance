<div ng-controller="QuoteController">
    <card-box title="{{ trans('quote.title') }}" ng-init="quote={{ json_encode($quote) }}">
        <card-box-body>
            <div class="text-muted">
                @{{ quote.quote }}
                &nbsp;-&nbsp;
                <span class="label label-info">@{{ quote.author }}</span>
            </div>
            <hr>
            <button ng-disabled="loading" class="btn btn-default" ng-click="fetchRandom()">
                <i class="zmdi zmdi-refresh-sync"></i>
                &nbsp;
                {{ trans('quote.btn.more') }}
            </button>

        </card-box-body>
    </card-box>
</div>