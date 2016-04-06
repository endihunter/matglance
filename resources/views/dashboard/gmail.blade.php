<div ng-controller="GmailController">
    <card-box title="{{ trans('gmail.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('gmail.settings.title') }}</h5>
            </div>
            <form ng-submit="fetchMessages()" novalidate name="form" class="form-horizontal">
                <div ng-show="!searchMode">
                    <div class="form-group">
                        <div class="input-group">
                            <input ng-focus="toggleSearchMode()" value="@{{ query }}" type="text" class="form-control" placeholder="{{ trans('gmail.search') }}">
                            <span class="input-group-btn">
                                <button type="button" disabled class="btn waves-effect waves-light btn-primary">
                                <i class="fa fa-search"></i></button>
                            </span>
                        </div>
                    </div>
                </div>
                <div ng-show="searchMode">
                    <div class="form-group">
                        <input type="text" autofocus class="form-control input-sm" placeholder="{{ trans('gmail.from') }}" ng-model="filter.from"/>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control input-sm" placeholder="{{ trans('gmail.to') }}" ng-model="filter.to"/>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control input-sm" placeholder="{{ trans('gmail.subject') }}" ng-model="filter.subject"/>
                    </div>
                    <div class="form-group">
                        <input id="gmail_include_spam" type="checkbox" ng-model="filter.includeSpamTrash">&nbsp;
                        <label for="gmail_include_spam">{{ trans('gmail.include_spam') }}</label>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="form-group">
                    <button class="btn btn-primary" ng-disabled="loading" type="submit">{{ trans('gmail.btn_search') }}</button>
                    <button class="btn btn-default" type="button" ng-click="$parent.switchEditableMode(toggleSearchMode)">Cancel</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>

            <div ng-if="message" class="g-message-block">
                <a ng-click="backToList()" class="btn btn-default">
                    <i class="zmdi zmdi-long-arrow-return"></i>
                    {{ trans('gmail.btn_back') }}
                </a>
                <a ng-href="https://mail.google.com/mail/u/0/#inbox/@{{ message.id }}" target="_blank" class="btn btn-link">
                    <i class="class zmdi zmdi-swap"></i>
                    {{ trans('gmail.btn_gmail') }}
                </a>
                <br /><br />

                <table class="table">
                    <tr>
                        <td>{{ trans('gmail.from') }}</td>
                        <td>@{{ message.from[0] }} <@{{ message.from[1] }}></td>
                    </tr>
                    <tr>
                        <td>{{ trans('gmail.subject') }}</td>
                        <td>@{{ message.subject }}</td>
                    </tr>
                    <tr>
                        <td colspan="2" ng-bind-html="message.body.plain"></td>
                    </tr>
                </table>
                <div class="clearfix"></div>
            </div>

            <ul class="list-group" ng-if="! message">
                <li class="g-message-list-item list-group-item" ng-repeat="message in messages">
                    <a ng-click="readMessage(message.id)">
                        <small class="label label-default pull-right">@{{ message.date }}</small>
                        <span class="msg-from pull-left">
                            @{{ message.from[1] || message.from[0] }}
                        </span>
                        <div class="clearfix"></div>
                        <span class="msg-subject text-dark" ng-class="{'font-bold': isUnRead(message)}">
                            @{{ message.subject }}
                        </span><br/>
                        <small class="msg-snippet text-muted" ng-bind-html="message.snippet"></small>
                        <div class="clearfix"></div>
                    </a>
                </li>
            </ul>

            <div class="clearfix"></div>
        </card-box-body>
    </card-box>
</div>