(function(){
    var GEOCODEAPI_URL = 'http://maps.googleapis.com/maps/api/geocode/json';

    var PullPanel = (function(){
        function PullPanel(className) {
            this._className = className;
            this._jqPanel = $(className);

            //clode the lateral panel
            this._jqPanel.on('click', function(event){
                var isClose = $(event.target).is('.cd-panel');
            
                if(isClose) { 
                    // TODO : ask the user whether to save changes before close it.
                    panel.close();
                    event.preventDefault();
                }
            });
        }

        PullPanel.prototype.setTitle = function(addr) {
            $('.pull-whereis').text(addr);
        };

        PullPanel.prototype.open = function() {
            this._jqPanel.addClass('is-visible');
        };

        PullPanel.prototype.close = function() {
            this._jqPanel.removeClass('is-visible');
        };

        PullPanel.prototype.save = function(pullMarker) {
             // TODO : insert new pull record.

            // place marker if save success
            pullMarker.placeIt();
            this.close();
        };

        return PullPanel;
    })();

    var PullMarker = (function(){

        function PullMarker(map, latLng) {
            this._map = map;
            this._latLng = latLng;
            this._id = null;
            this._addr = null;
            this._marker = null;            
        }

        PullMarker.prototype.setId = function(id) {
            this._id = id;
        };

        PullMarker.prototype.getId = function(id) {
            return this._id;
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
            (function(marker,id) {
                google.maps.event.addListener(marker, 'click', function(){
                    // TODO : show the pull record.
                    console.log(id);
                });
            })(this._marker, this._id);

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
        panel = new PullPanel('.cd-panel');
        newPullMarker = null;

    var getJsonSync = function(url) {

        var jqxhr = $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            cache: false,
            async: false,
        });

        return {
            valid: jqxhr.statusText,
            data: jqxhr.responseJSON
        };
    };




    var placePullMarker = function(map, bounds) {

        var randOp = function(a , b) {
            var op = Math.round(Math.random()*1);

            if (0 === op) {
                return a+b;
            }

            return a-b;
        };

        var generatRandLatLng = function(baseLatLng) {
            var randLat = randOp(baseLatLng.lat, (Math.round(Math.random()*100)/10000));
            var randLng = randOp(baseLatLng.lng, (Math.round(Math.random()*100)/10000));

            return {
                lat: randLat,
                lng: randLng
            };
        };

        $.ajax('pull/all',
            {
                data: {
                    'bounds': bounds.toUrlValue()
                },
                dataType: 'JSON',
                success: function(responseJson){
                    if (responseJson.status === 'OK') {
                        var pullList = responseJson.pulls;

                        pullList.forEach(function(pull){
                            var id = pull.id;
                            var pullJson = generatRandLatLng(pull);
                            var loc = new google.maps.LatLng(pullJson.lat, pullJson.lng);
                            var marker = new PullMarker(map, loc);
                            marker.setId(id);
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
        placePullMarker(map,bounds);        
    });

    google.maps.event.addListener(map, 'click', function(event) {
        newPullMarker = new PullMarker(map, event.latLng);
        var addr = newPullMarker.getAddress();
        panel.setTitle(addr);
        panel.open();
    });

    $('.pull-save').on('click', function(event){
        event.preventDefault();
        panel.save(newPullMarker);
    });

    $('.pull-cancel').on('click', function(event){
        event.preventDefault();
        panel.close();        
    });

})(window);