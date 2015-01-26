@section('header')
{{ HTML::style('css/pull.css') }}
{{ HTML::style('css/slide.css') }}
@stop

@section('content')
<main class="cd-main-content">
    <input id="loc-input" class="form-control" type="text" placeholder="您要去哪裡?">
    <div id="map-canvas"></div>
</main>
<div class="cd-panel from-right">
</div> <!-- cd-panel -->
@stop

@section('script')
<script>
  $(document).ready(function(){
    $.material.init();
  });
</script>
<script type="text/template" id="panel_tpl">
  <header class="cd-panel-header">
    <h1 class="pull-whereis"><%= address %></h1>
  </header>

  <div class="cd-panel-container">
    <div class="cd-panel-content">
      <div class="well pull-box">
        <textarea class="pull-content form-control" rows="10" placeholder='有什麼話，想對土地公公訴苦？'></textarea>
        <button class="btn btn-primary pull-save">
          儲存
        </button>
        <button class="btn btn-default pull-cancel">
          取消
        </button>
      </div> <!-- pull-box -->
      <div class='pull-confides-box'>
        <div class='pull-confides'>
          <% _.each(confides, function(confide){ %>
          <div class='well well-sm'>
            <p class='text-right'>
              <time is="relative-time" datetime="<%= confide.created_at %>"></time>
            </p>
            <blockquote><%= confide.content %></blockquote>
          </div>
          <% }); %>
        </div>
      </div> <!-- pull-confides -->
    </div> <!-- cd-panel-content -->
  </div> <!-- cd-panel-container -->
</script>

{{ HTML::script('https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places') }}
{{ HTML::script('js/libs/underscore-min.js') }}
{{ HTML::script('js/libs/backbone-min.js') }}
{{ HTML::script('js/libs/polymer-0.5.2.min.js') }}
{{ HTML::script('js/libs/time-elements.js') }}
{{ HTML::script('js/pull.js') }}
{{ HTML::script('js/map.js') }}
@stop