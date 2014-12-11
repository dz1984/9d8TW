(function(){
    var GEOCODEAPI_URL = 'http://maps.googleapis.com/maps/api/geocode/json';

    $(document).ready(function() {

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

        // setting search bar
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var placeMarker = function(location) {
            var marker = new google.maps.Marker({
              position: location,
              map: map,
              icon: {
                url: 'images/fist-icon.png',
                scaledSize: new google.maps.Size(20, 20),
                origin: new google.maps.Point(0,0)
              }
            });

            map.setCenter(location);
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

        google.maps.event.addListener(map, 'bounds_changed', function() {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });

        google.maps.event.addListener(map, 'click', function(event) {
            markerLocation = event.latLng;
            // translate the location to address
            geoLocToAddr(markerLocation);

            openPullPanel();
        });

        var openPullPanel = function() {
            $('.cd-panel').addClass('is-visible');
        };

        var closePullPanel = function() {
            $('.cd-panel').removeClass('is-visible');
        };

        $('.pull-save').on('click', function(event){
            placeMarker(markerLocation);
            closePullPanel();
            event.preventDefault();
        });

        $('.pull-cancel').on('click', function(event){
            closePullPanel();
            event.preventDefault();
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
    }); // end document ready
})();