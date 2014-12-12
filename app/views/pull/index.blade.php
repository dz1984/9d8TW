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
  </header>

  <div class="cd-panel-container">
    <div class="cd-panel-content">
      <div class="well pull-box">
        <textarea class="pull-content form-control" rows="20" placeholder='有什麼話，想對土地公公訴苦？'></textarea>
        <button class="btn btn-primary pull-save">
          儲存
        </button>
        <button class="btn btn-default pull-cancel">
          取消
        </button>
      </div>
    </div> <!-- cd-panel-content -->
  </div> <!-- cd-panel-container -->
</div> <!-- cd-panel -->
@stop

@section('script')
{{ HTML::script('https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places') }}
{{ HTML::script('js/pull.js') }}

<script>
  $(document).ready(function(){
    $.material.init();
  });
</script>
@stop