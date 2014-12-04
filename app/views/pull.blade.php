@extends('layouts.default')
@section('header')
{{ HTML::style('css/slide.css') }}
@stop

@section('content')
<main class="cd-main-content">
    <!-- your content here -->
    <div id="map-canvas"></div>
</main>
  <div class="cd-panel from-right">
    <header class="cd-panel-header">
      <h1>輸入區</h1>
      <button class="cd-panel-close btn btn-default"><i class="mdi-navigation-close"></i></button>
    </header>

    <div class="cd-panel-container">
      <div class="cd-panel-content">
        
      </div> <!-- cd-panel-content -->
    </div> <!-- cd-panel-container -->
  </div> <!-- cd-panel -->

@stop

@section('script')
{{ HTML::script('https://maps.googleapis.com/maps/api/js?v=3.exp') }}
<script>
$(document).ready(function() {

  var placeMarker = function(location) {
  var marker = new google.maps.Marker({
      position: location,
      map: map
  });

  map.setCenter(location);
}
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

      google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
        $('.cd-panel').addClass('is-visible');
      });

  //clode the lateral panel
  $('.cd-panel').on('click', function(event){
    var isClose = ['.cd-panel', '.cd-panel-close', '.mdi-navigation-close'].some(function(element){
        return $(event.target).is(element);
    });
    if(isClose) { 
      $('.cd-panel').removeClass('is-visible');
      event.preventDefault();
    }
  });
});
</script>
@stop