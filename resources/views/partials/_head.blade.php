<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Terranet.md">

    <!-- App Favicon -->
    <link rel="shortcut icon" href="{{ asset('assets/images/favicon.ico') }}">

    <!-- App title -->
    <title>{{ config('app.name') }}</title>

    <!-- App CSS -->
    <link href="{{ asset('css/vendor.css') }}" rel="stylesheet" type="text/css"/>
    {{--<link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css"/>--}}
    {{--<link href="{{ asset('assets/css/core.css') }}" rel="stylesheet" type="text/css"/>--}}
    {{--<link href="{{ asset('assets/css/components.css') }}" rel="stylesheet" type="text/css"/>--}}
    {{--<link href="{{ asset('assets/css/icons.css') }}" rel="stylesheet" type="text/css"/>--}}
    {{--<link href="{{ asset('assets/css/pages.css') }}" rel="stylesheet" type="text/css"/>--}}
    {{--<link href="{{ asset('assets/css/menu.css') }}" rel="stylesheet" type="text/css"/>--}}
    {{--<link href="{{ asset('assets/css/responsive.css') }}" rel="stylesheet" type="text/css"/>--}}

    <link rel="stylesheet" href="{{ asset(elixir('css/admin_'.config('app.theme').'.css')) }}">

    <link rel="stylesheet" href="{{ asset(elixir('css/helpers.css')) }}">

    <!-- HTML5 Shiv and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->


    <script src="{{ asset('assets/js/modernizr.min.js') }}"></script>

    <script>
        window['lang'] = '{{ config('app.locale') }}';
        @if (auth()->check())
        window['gid'] = '{{ auth()->user()->google_id }}';
        window['api_token'] = '{{ auth()->user()->api_token }}';
        @endif
    </script>
</head>