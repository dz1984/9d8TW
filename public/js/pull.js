var Pull = (function(){
  'use strict';
  var GEOCODEAPI_URL = 'http://maps.googleapis.com/maps/api/geocode/json';

  var getJsonSync = function(url) {

    var jqxhr = $.ajax({
        type: 'GET',
        url: url,
        dataType: 'JSON',
        cache: false,
        async: false,
    });

    return {
        valid: jqxhr.statusText,
        data: jqxhr.responseJSON
    };
  };

  function Panel(className) {

      var _self = this;

      var defaultClassName = {
          panel: '.cd-panel',
          title: '.pull-whereis',
          content: '.pull-content',
          box: '.pull-box',
          confides: '.pull-confides',
          saveBtn:     '.pull-save',
          cancelBtn: '.pull-cancel'
      };

      if (typeof className === 'undefined') {
          className = defaultClassName;
      }

      this._className = {};

      $.extend(this._className, defaultClassName, className);

      this._jqPanel = $(this._className.panel);
      this._jqTitle = $(this._className.title);
      this._jqContent = $(this._className.content);
      this._jqBox = $(this._className.box);
      this._jqConfides = $(this._className.confides);
      this._jqSaveBtn = $(this._className.saveBtn);
      this._jqCancelBtn = $(this._className.cancelBtn);

      this._marker = null;

      this._jqSaveBtn.on('click', function() {
        _self.save();
      });

      this._jqCancelBtn.on('click', function(){
        _self.close();
      });

      // private method
      this._init = function(marker) {
          this._marker = marker;

          var _self = this;
          var content = this._marker.getContent();
          var addr = this._marker.getAddress();
          var confides = this._marker.getConfides();

          if (null !== content) {
              this._setContent(content);
          }

          if (null !== addr ) {
              this._setTitle(addr);
          }

          if (null !== confides) {
              this._setConfides(confides);
          }

      };

      this._reset = function() {
          this._marker = null;
          this._setTitle('');
          this._clearContent();
          this._clearConfides();
      };

      this._save = function(saveData) {
          var jqxhr = $.ajax({
              type: 'GET',
              url: 'pull/add',
              data: saveData,
              dataType: 'JSON',
              cache: false,
              async: false,
          });

          return {
              valid: jqxhr.statusText,
              data: jqxhr.responseJSON
          };
      };

      this._setTitle = function(addr) {
          this._jqTitle.text(addr);
       };

      this._clearContent = function() {
          this._setContent('');
      };

      this._setContent = function(content) {
          this._jqContent.val(content);
      };

      this._getContent = function() {
          var content = $.trim(this._jqContent.val());

          return content;
      };

      this._setConfides = function(confides) {
          this._clearConfides();
          
          var jqConfides = this._jqConfides;

          confides.forEach(function(confide){
              var content = confide.content;
              var jqBlockquote = $("<blockquote>").text(content);
              var jqConfide = $("<div>")
                                  .addClass('well well-sm')
                                  .append(jqBlockquote);

              jqConfides.append(jqConfide);
          });
      };

      this._clearConfides = function() {
          this._jqConfides.text('');
      };

  }

  Panel.prototype.open = function(marker) {
      this._init(marker);
      this._jqPanel.addClass('is-visible');
  };

  Panel.prototype.close = function() {
      this._reset();
      this._jqPanel.removeClass('is-visible');
  };

  Panel.prototype.save = function() {
      var _self = this;
      
      var markerId = this._marker.getId();
      var content = this._getContent();
      var markerAddr = this._marker.getAddress();
      var markerLatLng = this._marker.getLatLng();

      var saveData = {
          id: markerId,
          lat: markerLatLng.lat(),
          lng: markerLatLng.lng(),
          addr: markerAddr,
          content: content
      };

      // insert new pull record.
      var reply = this._save(saveData);

      if ('OK' === reply.valid && 'OK' === reply.data.status) {

          var id = reply.data.pull.id;
          var confides = reply.data.pull.confides;

          this._marker.setId(id);
          this._marker.setConfides(confides);
          // place marker if save success
          var marker = this._marker;

          this._marker.addClickCallback(function(event){
              _self.open(marker);
          });

          this._marker.placeIt();
      }

      this.close();
  };

  function Marker(opts) {
    var defaultOpt = {
        map: null,
        latLng: null,
        id: null,
        addr: null,
        content: null,
        marker: null,
        confides: null,
        clickCallback: []
    };

    this._opts = {};

    $.extend(this._opts,defaultOpt, opts);

  }

  Marker.prototype.addClickCallback = function(callback) {
      // TODO : check the callback type is function
      this._opts.clickCallback.push(callback);
  };

  Marker.prototype.getLatLng = function() {
      return this._opts.latLng;
  };

  Marker.prototype.setId = function(id) {
      this._opts.id = id;
  };

  Marker.prototype.getId = function() {
      return this._opts.id;
  };

  Marker.prototype.setContent = function(content) {
      this._opts.content = content;
  };

  Marker.prototype.getContent = function() {
      return this._opts.content;
  };

  Marker.prototype.getConfides = function() {
      return this._opts.confides;
  };

  Marker.prototype.setConfides = function(confides) {
      this._opts.confides = confides;
  };

  Marker.prototype.setAddress = function(addr) {
      this._opts.addr = addr;
  };

  Marker.prototype.getAddress = function() {
      if (this._opts.addr !== null) {
          return this._opts.addr;
      }

      var strLocation = this._opts.latLng.toUrlValue();
      var param = $.param({
          'latlng': strLocation,
          'components': 'route'
      });

      var apiUrl = GEOCODEAPI_URL + '?' + param;
      var reply = getJsonSync(apiUrl);

      if (reply.valid == 'OK' && reply.data.status == 'OK') {
          this._opts.addr = reply.data.results[0].formatted_address;
      } 

      return (null === this._opts.addr)?'不知名地方':this._opts.addr;
  };

  Marker.prototype.placeIt = function(center) {
      if (typeof center === 'undefined') {
          center = true;
      }

      var markerOptions = {
        position: this._opts.latLng,
        map: this._opts.map,
        icon: {
          url: 'images/fist-icon.png',
          scaledSize: new google.maps.Size(20, 20),
          origin: new google.maps.Point(0,0)
        }
      };

      this._opts.marker = new google.maps.Marker(markerOptions);

      // marker event handler
      (function(id, marker, callbackList) {
          google.maps.event.addListener(marker, 'click', function(event){
              callbackList.forEach(function(callback){
                  callback(event);
              });
          });
      })(this._opts.id, this._opts.marker, this._opts.clickCallback);

      if (true === center){
          this._opts.map.setCenter(this._opts.latLng);
      }
  };
    
  return {
    'Panel' : Panel,
    'Marker': Marker
  };

})();