<div ng-controller="GmailController">
    <card-box title="{{ trans('gmail.title') }}">
        <card-box-actions>
            <div class="form-group">
                <h5>{{ trans('gmail.settings') }}</h5>
            </div>
            <form ng-submit="fetchMessages()" novalidate name="form" class="form-horizontal">
                <div ng-show="!searchMode">
                    <div class="form-group">
                        <div class="input-group">
                            <input ng-focus="toggleSearchMode(true)" value="@{{ query }}" type="text" class="form-control" placeholder="{{ trans('gmail.search') }}">
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
                    <button class="btn btn-primary" ng-disabled="loading" type="submit">{{ trans('buttons.search') }}</button>
                    <button class="btn btn-default" type="button" ng-click="toggleSearchMode(false, $parent.switchEditableMode)">{{ trans('buttons.cancel') }}</button>
                </div>
            </form>
        </card-box-actions>
        <card-box-body>
            <div>
                <div ng-if="message">
                    <a ng-click="backToList()" class="btn btn-default">
                        <i class="zmdi zmdi-long-arrow-return"></i>
                        {{ trans('buttons.back') }}
                    </a>
                    <a ng-href="https://mail.google.com/mail/u/0/#inbox/@{{ message.id }}" target="_blank" class="btn btn-link">
                        <i class="class zmdi zmdi-swap"></i>
                        {{ trans('buttons.view_in_gmail') }}
                    </a>
                    <br/><br/>

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
                            <td colspan="2">
                                <iframe id="msg-iframe" height="0" width="100%" ng-src="@{{ fullMessageUrl(message.id) }}" frameborder="0" scrolling="0"></iframe>
                            </td>
                        </tr>
                    </table>
                    <div class="clearfix"></div>
                </div>

                <div ng-if="! message" style="overflow: hidden">
                    <ul class="list-group">
                        <li ng-if="loading" class="g-message-list-item list-group-item">{{ trans('gmail.loading') }}</li>
                        <li ng-click="readMessage(message.id)" class="g-message-list-item list-group-item" ng-repeat="message in messages">
                            <small class="label label-default pull-right">@{{ message.date }}</small>
                        <span class="msg-from pull-left">
                            @{{ message.from[1] || message.from[0] }}
                        </span>
                            <br class="clearfix" />
                        <span class="msg-subject text-dark" ng-class="{'font-bold': isUnRead(message)}">
                            @{{ message.subject }}
                        </span><br/>
                            <small class="msg-snippet text-muted" ng-bind-html="message.snippet"></small>
                            <br class="clearfix" />
                        </li>
                    </ul>
                </div>

                <div class="clearfix"></div>
            </div>
        </card-box-body>
    </card-box>
</div>