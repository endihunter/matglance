<!DOCTYPE html>
<html ng-app="app">

@include('partials._head')

<body>
<div class="account-pages"></div>
<div class="clearfix"></div>
<div class="wrapper-page">
    <div class="text-center">
        <a href="index.html" class="logo"><span>Admin<span>to</span></span></a>
        <h5 class="text-muted m-t-0 font-600">{{ config('app.name') }}</h5>
    </div>
    <div class="m-t-40 card-box">
        <div class="text-center">
            <?php
            $action = ($name = Cookie::get('ymag_name')) ? 'auth.sign_in' : 'auth.sign_up';
            ?>
            <h3 class="text-uppercase font-bold m-b-0">{{ trans($action) }}</h3>
            @if ($name)
            <span class="text-muted">{{ trans('auth.hello', ['name' => $name]) }}</span>
            @endif
        </div>
        <div class="panel-body">
            <div class="form-group text-center">
                <br />
                <a href="{{ url('auth/google') }}" class="btn btn-danger">
                    <i class="fa fa-google-plus"></i>&nbsp;
                    {{ trans($action . '_with_g_plus') }}
                </a>
            </div>
        </div>
    </div>
    <!-- end card-box-->
</div>
<!-- end wrapper page -->

@include('partials._javascript')
</body>
</html>
