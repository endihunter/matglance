<div class="user-box">
    <div class="user-img">
        <a target="_blank" href="{{ ($userUrl = auth()->user()->url ? : '#') }}">
            <img src="{{ auth()->user()->avatar ?: '/assets/images/users/avatar-1.jpg' }}" alt="user-img" title="Mat Helme" class="img-circle img-thumbnail img-responsive"/>
        </a>
        {{--<div class="user-status online"><i class="zmdi zmdi-dot-circle"></i></div>--}}
    </div>

    <h5><a target="_blank" href="{{ $userUrl }}">{{ auth()->user()->name }}</a></h5>
</div>