<div ng-controller="QuoteController">
    <card-box title="{{ trans('quote.title') }}" ng-init="quote={{ json_encode($quote) }}">
        <card-box-body>
            <div style="height:150px;">
                <div ng-if="! quote.id">
                    {{ trans('quote.not_found') }}
                </div>
                <div ng-if="quote.id">
                    <div class="well2 p-l-r-10">
                        @{{ quote.quote }}
                        &nbsp;&nbsp;
                        <span class="label label-success">@{{ quote.author }}</span>
                        <button class="btn btn-link" ng-click="fetchRandom()">
                            {{ trans('buttons.more') }}
                            <i class="zmdi zmdi-long-arrow-right"></i>
                        </button>
                    </div>

                </div>
            </div>
        </card-box-body>
    </card-box>
</div>