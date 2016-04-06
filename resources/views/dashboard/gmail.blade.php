<div ng-controller="GmailController">
    <card-box title="{{ trans('gmail.title') }}">
        <card-box-body>
            <ul class="list-group">
                <li class="list-group-item" ng-repeat="message in messages">
                    <small class="label label-default pull-right">@{{ message.date }}</small>
                    <span class="msg-from pull-left">
                        @{{ message.from[0] }}
                    </span>
                    <div class="clearfix"></div>
                    <a ng-click="readMessage(message.id)" class="msg-subject text-dark">
                        @{{ message.subject }}
                    </a><br />
                    <small class="msg-snippet text-muted">
                        @{{ message.snippet }}
                    </small>

                    {{--<div class="m-t-10 m-b-10">--}}
                        {{--<small class="label label-inverse m-r-5" ng-repeat="label in message.labels">--}}
                            {{--@{{ label }}--}}
                        {{--</small>--}}
                    {{--</div>--}}
                </li>
            </ul>
        </card-box-body>
    </card-box>
</div>