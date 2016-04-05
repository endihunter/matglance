@extends('app')

@section('content')
    <div class="ng-cloak">
        <div class="row">
            <div class="col-lg-6">
                @include('dashboard.weather')
            </div>
            <div class="col-lg-6">
                @include('dashboard.rss')
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6 ">
                @include('dashboard.gmail')
            </div>
            <div class="col-lg-6">
                @include('dashboard.calendar')
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6">
                @include('dashboard.quote')
            </div>
            <div class="col-lg-6">

            </div>
        </div>
    </div>

@endsection