(function(){
    var GEOCODEAPI_URL = 'http://maps.googleapis.com/maps/api/geocode/json';

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
        markerLocation = null;

    var placeMarker = function(location, center) {
        if (typeof center === 'undefined') {
            center = true;
        }

        var mockPullId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

        var marker = new google.maps.Marker({
          position: location,
          map: map,
          attribution: {source: mockPullId},
          icon: {
            url: 'images/fist-icon.png',
            scaledSize: new google.maps.Size(20, 20),
            origin: new google.maps.Point(0,0)
          }
        });

        // marker event handler
        (function(marker) {
            google.maps.event.addListener(marker, 'click',function(){
                // TODO : show the pull record.\
                console.log(marker.getAttribution());
            });
        })(marker);

        if (true === center){
            map.setCenter(location);
        }
    };

    var placePullMarker = function(map) {

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
        var mockPullJson = [
            {lat: 25.0294008, lng: 121.5216733},
            {lat: 25.0175019, lng: 121.5218866}
        ];

        mockPullJson.forEach(function(pullJson){
            var pullJson = generatRandLatLng(pullJson);
            var loc = new google.maps.LatLng(pullJson.lat, pullJson.lng);
            placeMarker(loc, false);
        });

    };

    var geoLocToAddr = function(location) {
        var strLocation = location.toUrlValue(),
            param = $.param({
                'latlng': strLocation,
                'components': 'route'
            }),
            url = GEOCODEAPI_URL + '?' + param;

        $.getJSON(url, function(geoJSON) {
            if ('OK' === geoJSON.status) {
                // render the address
                var addr = geoJSON.results[0].formatted_address;
                $('.pull-whereis').text(addr);
            }
        });
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
        placePullMarker(map);        
    });

    google.maps.event.addListener(map, 'click', function(event) {
        markerLocation = event.latLng;
        // translate the location to address
        geoLocToAddr(markerLocation);
        openPullPanel();
    });

    // Pull Panel
    var openPullPanel = function() {
        $('.cd-panel').addClass('is-visible');
    };

    var closePullPanel = function() {
        $('.cd-panel').removeClass('is-visible');
    };

    $('.pull-save').on('click', function(event){
        event.preventDefault();
        placeMarker(markerLocation);
        closePullPanel();
    });

    $('.pull-cancel').on('click', function(event){
        event.preventDefault();
        closePullPanel();        
    });

    //clode the lateral panel
    $('.cd-panel').on('click', function(event){
        var isClose = $(event.target).is('.cd-panel');
    
        if(isClose) { 
            // TODO : ask the user whether to save changes before close it.
            closePullPanel();
            event.preventDefault();
        }
    });
})(window);