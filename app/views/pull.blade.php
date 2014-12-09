@extends('layouts.default')
@section('header')
{{ HTML::style('css/slide.css') }}
{{ HTML::style('css/pull.css') }}
@stop

@section('content')
<main class="cd-main-content">
    <input id="loc-input" class="form-control" type="text" placeholder="您要去哪裡?">
    <div id="map-canvas"></div>
</main>
  <div class="cd-panel from-right">
    <header class="cd-panel-header">
      <h1 class="pull-whereis"></h1>
      <button class="cd-panel-close btn btn-default"><i class="mdi-navigation-close"></i></button>
    </header>

    <div class="cd-panel-container">
      <div class="cd-panel-content">
        <div class="well pull-box">
          <textarea class="form-control" rows="20" placeholder='有什麼話，想對土地公公訴苦？'></textarea>
        
          <button class="btn btn-primary  pull-save">
            <i class="mdi-navigation-check"></i>儲存
          </button>
          <button class="btn btn-default pull-cancel">
            <i class="mdi-navigation-close"></i>取消
          </button>
        </div>
      </div> <!-- cd-panel-content -->
    </div> <!-- cd-panel-container -->
  </div> <!-- cd-panel -->

@stop

@section('script')
{{ HTML::script('https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places') }}
{{ HTML::script('js/pull.js') }}
$.material.init();
@stop