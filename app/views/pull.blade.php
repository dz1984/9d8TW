@extends('layouts.default')

@section('content')
<div class="row pull-block">
    <div class="col-md-6">
        <h3>輸入區塊</h3>

    </div>
    <div class="col-md-6 pop-map">
            <h3>Google Map</h3>
            <div id="map-canvas"></div>
    </div>
</div>
@stop

@section('script')
{{ HTML::script('https://maps.googleapis.com/maps/api/js?v=3.exp') }}
<script>
var lat = 25.0293008,
    lng = 121.5205833,
    map = new google.maps.Map(document.getElementById("map-canvas"), {
      zoom: 15,
      scrollwheel: false,
      center: {
        lat: lat,
        lng: lng
      }
    });
</script>
@stop