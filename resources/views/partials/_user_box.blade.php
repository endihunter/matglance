<div class="user-box">
    <div class="user-img">
        <img src="{{ auth()->user()->avatar ?: '/assets/images/users/avatar-1.jpg' }}" alt="user-img" title="Mat Helme" class="img-circle img-thumbnail img-responsive" />
        <div class="user-status online"><i class="zmdi zmdi-dot-circle"></i></div>
    </div>
    <h5><a href="#">{{ auth()->user()->name }}</a></h5>
    {{--<ul class="list-inline">--}}
        {{--<li>--}}
            {{--<a href="#">--}}
                {{--<i class="zmdi zmdi-settings"></i>--}}
            {{--</a>--}}
        {{--</li>--}}
        {{--<li>--}}
            {{--<a href="#" class="text-custom">--}}
                {{--<i class="zmdi zmdi-power"></i>--}}
            {{--</a>--}}
        {{--</li>--}}
    {{--</ul>--}}
</div>