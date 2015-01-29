var Pull = (function(){
  'use strict';
  var GEOCODEAPI_URL = 'http://maps.googleapis.com/maps/api/geocode/json';

  var getJsonSync = function(url, data) {

    if (_.isUndefined(data)) {
      data = {};
    }
    
    var jqxhr = $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'JSON',
        cache: false,
        async: false,
    });

    return {
        valid: jqxhr.statusText,
        data: jqxhr.responseJSON
    };
  };

  var Panel = Backbone.View.extend({
    el: '.cd-panel',
    events: {
      "click .pull-save": "save",
      "click .pull-cancel": "close"
    },
    model: null,
    template: _.template($("#panel_tpl").html()),
    initialize: function(options) {
      if (!_.isUndefined(options)){
        $.extend({}, this.defaults, options);
      }
    },
    _init: function(fist) {
      this.model = fist;
    },
    _reset: function(){
      this.model = null;
    },
    open: function(fist) {
      this._init(fist);
      this.$el.addClass('is-visible');
      this.render();
    },
    close: function() {
      this._reset();
      this.$el.removeClass('is-visible');
    },
    save: function() {
      var id = this.model.get('id');
      var content = this.$el.find('.pull-content').val();
      var address = this.model.get('address');
      var latLng = this.model.get('latLng');

      if ('' === $.trim(content)) {
        // TODO : show the notice message.
        this.close();
        return false;
      }

      var saveData = {
          id: id,
          lat: latLng.lat(),
          lng: latLng.lng(),
          address: address,
          content: content
      };

      // insert new pull record.
      var reply = getJsonSync('pull/add', saveData);

      if ('OK' === reply.valid && 'OK' === reply.data.status) {

          var id = reply.data.pull.id;
          var confides = reply.data.pull.confides;

          this.model.set({id:id, confides:confides});

          this.model.addDefaultClickCallback(this);

          // place marker if save success
          this.model.place();
      }

      this.close();
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
    }
  });

  var Fist = Backbone.Model.extend({
    defaults: {
      map: null,
      latLng: null,
      id: null,
      address: null,
      marker: null,
      confides: [],
      clickCallback: []
    },
    initialize: function(options) {
      if (!_.isUndefined(options)) {
        $.extend({}, this.defaults, options);
      }
      
      if (this._isNeedToFindAddress()) {
        var address = this._findoutAddress(this.get('latLng'));
        this.set({address: address});
      }
    },
    _isNeedToFindAddress: function() {
      return _.isNull(this.get('address')) && !_.isNull(this.get('latLng'));
    },
    _findoutAddress: function(latLng) {
      var strLocation = latLng.toUrlValue();
      var param = $.param({
          'latlng': strLocation,
          'components': 'route'
      });

      var apiUrl = GEOCODEAPI_URL + '?' + param;
      var reply = getJsonSync(apiUrl);
      var address = null;

      if (reply.valid == 'OK' && reply.data.status == 'OK') {
          address = reply.data.results[0].formatted_address;
      } 

      return _.isNull(address)?'不知名地方':address;
    },
    addClickCallback: function(callback) {
      // check the callback type is function
      if (_.isFunction(callback)) {
        this.get('clickCallback').push(callback);
      }
    },
    addDefaultClickCallback: function(panel){
      // TODO : check the panel type
      this.addClickCallback(function() {
          panel.open(this);
      });
    },
    place: function(center) {
      if (_.isUndefined(center)) {
        center = false;
      }

      var markerOptions = {
        position: this.get('latLng'),
        map: this.get('map'),
        icon: {
          url: 'images/fist-icon.png',
          scaledSize: new google.maps.Size(20, 20),
          origin: new google.maps.Point(0,0)
        }
      };

      this.set({marker: new google.maps.Marker(markerOptions)});

      // marker event handler
      (function(obj, id, marker, callbackList) {
          google.maps.event.addListener(marker, 'click', function(event){
              callbackList.forEach(function(callback){
                  callback.bind(obj, event)();
              });
          });
      })(this, this.get('id'), this.get('marker'), this.get('clickCallback'));

      if (true === center){
          this.get('map').setCenter(this.get('latLng'));
      }
    }
  });

  return {
    'Panel' : Panel,
    'Fist': Fist
  };

})();