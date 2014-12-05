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
            markerLocation = null;

        var placeMarker = function(location) {
            var marker = new google.maps.Marker({
              position: location,
              map: map
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
                    // TODO : render the address
                    var addr = geoJSON.results[0].formatted_address;
                    $('.pull-whereis').text(addr);
                }
            });
        };

        google.maps.event.addListener(map, 'click', function(event) {
            markerLocation = event.latLng;
            // TODO : change the location to address
            geoLocToAddr(markerLocation);

            $('.cd-panel').addClass('is-visible');
        });

        $('.pull-save').on('click',function(event){
            placeMarker(markerLocation);
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
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
    }); // end document ready
})();