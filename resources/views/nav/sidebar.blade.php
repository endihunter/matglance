<div id="sidebar-menu">
    <ul>
        <li class="text-muted menu-title">{{ trans('general.navigation') }}</li>

        <li>
            <a href="{{ url('/') }}" class="waves-effect">
                <i class="zmdi zmdi-view-dashboard"></i>
                <span> {{ trans('general.dashboard') }} </span>
            </a>
        </li>

        <li class="has_sub">
            <a href="javascript:void(0);" class="waves-effect">
                <i class="zmdi zmdi-map"></i>
                <span> {{ trans('general.language') }} </span>
                <span class="menu-arrow"></span>
            </a>
            <ul class="list-unstyled">
                @foreach(config('languages') as $slug => $title)
                    <li class="{{ ($slug == auth()->user()->lang() ? 'active' : '') }}"><a href="{{ route('user.prefs.lang', ['language' => $slug]) }}">{{ $title }}</a></li>
                @endforeach
            </ul>
        </li>

        <li class="has_sub">
            <a href="javascript:void(0);" class="waves-effect">
                <i class="zmdi zmdi-layers"></i>
                <span> {{ trans('general.theme') }} </span>
                <span class="menu-arrow"></span>
            </a>
            <ul class="list-unstyled">
                <li><a href="/en">Light</a></li>
                <li><a href="/de">Dark</a></li>
                <li><a href="/de">Purple</a></li>
            </ul>
        </li>

        <li>
            <a href="{{ url('logout') }}" class="waves-effect text-danger">
                <i class="zmdi zmdi-square-right"></i>
                <span> {{ trans('general.logout') }} </span>
            </a>
        </li>

    </ul>
    <div class="clearfix"></div>
</div>