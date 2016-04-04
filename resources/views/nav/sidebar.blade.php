<div id="sidebar-menu">
    <ul>
        <li class="text-muted menu-title">Navigation</li>

        <li>
            <a href="{{ url('/') }}" class="waves-effect">
                <i class="zmdi zmdi-view-dashboard"></i>
                <span> Dashboard </span>
            </a>
        </li>

        <li class="has_sub">
            <a href="javascript:void(0);" class="waves-effect">
                <i class="zmdi zmdi-map"></i>
                <span> Language </span>
                <span class="menu-arrow"></span>
            </a>
            <ul class="list-unstyled">
                <li><a href="/en">English</a></li>
                <li><a href="/de">German</a></li>
            </ul>
        </li>

        <li class="has_sub">
            <a href="javascript:void(0);" class="waves-effect">
                <i class="zmdi zmdi-layers"></i>
                <span> Color Scheme </span>
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
                <span> Logout </span>
            </a>
        </li>

    </ul>
    <div class="clearfix"></div>
</div>