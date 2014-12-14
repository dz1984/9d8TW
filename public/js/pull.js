(function(){
    var GEOCODEAPI_URL = 'http://maps.googleapis.com/maps/api/geocode/json';

    var PullPanel = (function(){
        function PullPanel(className) {

            var defaultClassName = {
                panel: '.cd-panel',
                title: '.pull-whereis',
                content: '.pull-content',
                confides: '.pull-confides'
            };

            if (typeof className === 'undefined') {
                className = defaultClassName;
            }

            this._className = {};

            $.extend(this._className, defaultClassName, className);

            this._jqPanel = $(this._className.panel);
            this._jqTitle = $(this._className.title);
            this._jqContent = $(this._className.content);
            this._jqConfides = $(this._className.confides)
            this._marker = null;

            // private method
            this._init = function(marker) {
                this._marker = marker;
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
                var jqConfides = this._jqConfides;
                confides.forEach(function(confide){
                    var content = confide.content;
                    var jqConfide = $("<div>");
                    var jqBlockquote = $("<blockquote>");
                    jqBlockquote.text(content);
                    jqConfide.addClass('well well-sm');
                    jqConfide.append(jqBlockquote);
                    jqConfides.append(jqConfide);
                });
            };

            this._clearConfides = function() {
                this._jqConfides.text('');
            };

        }

        PullPanel.prototype.open = function(marker) {
            this._init(marker);
            this._jqPanel.addClass('is-visible');
        };

        PullPanel.prototype.close = function() {
            this._reset();
            this._jqPanel.removeClass('is-visible');
        };

        PullPanel.prototype.save = function() {
            var markerId = this._marker.getId();
            var content = this._getContent();
            var markerAddr = this._marker.getAddress();
            var markerLatLng = this._marker.getLatLng();
            var mockSaveData = {
                id: markerId,
                lat: markerLatLng.lat(),
                lng: markerLatLng.lng(),
                addr: markerAddr,
                content: content
            };

            // TODO : insert new pull record.
            var reply = this._save(mockSaveData);

            if ('OK' === reply.valid && 'OK' === reply.data.status) {
                var confides = reply.data.pull.confides;
                this._marker.setConfides(confides);
                // place marker if save success
                this._marker.placeIt();
                this.close();
            }
        };

        return PullPanel;
    })();

    var PullMarker = (function(){

        function PullMarker(map, latLng) {
            this._map = map;
            this._latLng = latLng;
            this._id = null;
            this._addr = null;
            this._content = null;
            this._marker = null;   
            this._confides = null;
            this._clickCallback = [];       
        }

        PullMarker.prototype.addClickCallback = function(callback) {
            // TODO : check the callback type is function
            this._clickCallback.push(callback);
        };

        PullMarker.prototype.getLatLng = function() {
            return this._latLng;
        };

        PullMarker.prototype.setId = function(id) {
            this._id = id;
        };

        PullMarker.prototype.getId = function(id) {
            return this._id;
        };

        PullMarker.prototype.setContent = function(content) {
            this._content = content;
        };

        PullMarker.prototype.getContent = function() {
            return this._content;
        };

        PullMarker.prototype.getConfides = function() {
            return this._confides;
        };

        PullMarker.prototype.setConfides = function(confides) {
            this._confides = confides;
        };

        PullMarker.prototype.setAddress = function(addr) {
            this._addr = addr;
        };

        PullMarker.prototype.getAddress = function() {
            if (this._addr !== null) {
                return this._addr;
            }

            var strLocation = this._latLng.toUrlValue();
            var param = $.param({
                'latlng': strLocation,
                'components': 'route'
            });

            var apiUrl = GEOCODEAPI_URL + '?' + param;
            var reply = getJsonSync(apiUrl);

            if (reply.valid == 'OK' && reply.data.status == 'OK') {
                this._addr = reply.data.results[0].formatted_address;
            } 

            return (null === this._addr)?'不知名地方':this._addr;
        };

        PullMarker.prototype.placeIt = function(center) {
            if (typeof center === 'undefined') {
                center = true;
            }

            var markerOptions = {
              position: this._latLng,
              map: this._map,
              icon: {
                url: 'images/fist-icon.png',
                scaledSize: new google.maps.Size(20, 20),
                origin: new google.maps.Point(0,0)
              }
            };

            this._marker = new google.maps.Marker(markerOptions);

            // marker event handler
            (function(id, marker, callbackList) {
                google.maps.event.addListener(marker, 'click', function(event){
                    // TODO : show the pull record.
                    callbackList.forEach(function(callback){
                        callback(event);
                    });
                });
            })(this._id, this._marker, this._clickCallback);

            if (true === center){
                this._map.setCenter(this._latLng);
            }
        };

        return PullMarker;
    })();

    var lat = 25.0293008,
        lng = 121.5205833,
        mapOptions = {
            zoom: 15,
            scrollwheel: false,
            center: {
              lat: lat,
              lng: lng
            }
        },
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions),
        input = document.getElementById('loc-input'),
        searchBox = new google.maps.places.SearchBox(input),
        panel = new PullPanel();
        newPullMarker = null;

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

    var placeBoundPullMarker = function(map, bounds) {

        $.ajax('pull/all',
            {
                data: {
                    'bounds': bounds.toUrlValue()
                },
                dataType: 'JSON',
                success: function(responseJson){
                    if (responseJson.status === 'OK') {
                        var pullJsonList = responseJson.pulls;

                        pullJsonList.forEach(function(pullJson){
                            var id = pullJson.id;
                            var addr = pullJson.address;
                            var confides = pullJson.confides;
                            var loc = new google.maps.LatLng(pullJson.lat, pullJson.lng);
                            var marker = new PullMarker(map, loc);

                            marker.setId(id);
                            marker.setAddress(addr);
                            marker.setConfides(confides);
                            marker.addClickCallback(function(event){
                                panel.open(marker);
                            });
                            marker.placeIt(false);
                        });
                } // end success
            }
        }); // end ajax
    };

    // setting search bar
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Google map event handler
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        var bounds = new google.maps.LatLngBounds();

        for (var i = 0, place; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });

    google.maps.event.addListener(map, 'bounds_changed', function(event) {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

    google.maps.event.addListener(map, 'tilesloaded', function(event){    
        var bounds = map.getBounds();
        // TODO : load all pull json dataset between this bound and place marker
        placeBoundPullMarker(map,bounds);        
    });

    google.maps.event.addListener(map, 'click', function(event) {
        newPullMarker = new PullMarker(map, event.latLng);

        panel.open(newPullMarker);
    });

    $('.pull-save').on('click', function(event){
        event.preventDefault();
        panel.save();
    });

    $('.pull-cancel').on('click', function(event){
        event.preventDefault();
        panel.close();        
    });

})(window);