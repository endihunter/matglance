<div ng-controller="GmailController">
    <card-box title="{{ trans('gmail.title') }}">
        <card-box-body>
            <ul class="list-group">
                <li class="list-group-item">
                    <span class="badge badge-default">{{ date('d F Y') }}</span>
                    <strong>Cras justo odio</strong>
                </li>
                <li class="list-group-item">
                    <span class="badge badge-default">{{ date('d F Y') }}</span>
                    Dapibus ac facilisis in
                </li>
                <li class="list-group-item">
                    <span class="badge badge-default">{{ date('d F Y') }}</span>
                    Morbi leo risus
                </li>
                <li class="list-group-item">
                    <span class="badge badge-default">{{ date('d F Y') }}</span>
                    <strong>Morbi leo risus</strong>
                </li>
                <li class="list-group-item">
                    <span class="badge badge-default">{{ date('d F Y') }}</span>
                    Morbi leo risus
                </li>
            </ul>
        </card-box-body>
    </card-box>
</div>