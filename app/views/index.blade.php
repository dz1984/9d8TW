@extends('layouts.default')

@section('content')
<div class='container'>
  <div class="page-header">
    <div class="row">
      <div class="col-md-12">
      {{ HTML::image('images/logo.png') }}
      <h2>揪出一群侵佔公有地，作為私人用途之地霸行徑！</h2>
    </div>
    </div>
  </div>
  <div class="container-scence">
  <div class="row">
    <div class="col-md-12">
      <a href="pull">
      <ul id="scene" class="scene" data-limit-x="30" data-limit-y="false">
        <li class="layer" data-depth="0.40">{{ HTML::image("images/layout01.png") }}</li>
        <li class="layer" data-depth="0.60">{{ HTML::image("images/layout02.png") }}</li>
        <li class="layer" data-depth="0.80">{{ HTML::image("images/layout03.png") }}</li>
        <li class="layer" data-depth="1.00">{{ HTML::image("images/layout04.png") }}</li>
      </ul>
      </a>
    </div>
  </div>
  </div>
</div>
@stop

@section('script')
{{ HTML::script('js/libs/jquery.parallax.min.js') }}
<script>
  $(document).ready(function() {
    $('#scene').parallax();
  });
</script>
@stop
