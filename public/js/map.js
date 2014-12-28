
(function(){
    'use strict';
    var initLat = 25.0293008,
        initLng = 121.5205833,
        mapOptions = {
            zoom: 10,
            scrollwheel: false,
            center: {
              lat: initLat,
              lng: initLng
            }
        },
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions),
        input = document.getElementById('loc-input'),
        searchBox = new google.maps.places.SearchBox(input),
        strictBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(21.5, 119.1),
            new google.maps.LatLng(25.4, 122.4)
        ),
        minZoomLevel = 8,
        panel = new Pull.Panel();

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
           
                            var marker = new Pull.Marker(
                                {
                                    map: map, 
                                    latLng: new google.maps.LatLng(pullJson.lat, pullJson.lng),
                                    id: pullJson.id,
                                    addr:  pullJson.address,
                                    confides: pullJson.confides,               
                                }
                            );

                            marker.addDefaultClickCallback(panel);
                            
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

        if (places.length === 0) {
            return;
        }
        
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0, place; place = places[i]; i++) {
            // TODO : check the place location is over than Taiwan
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
        // load all pull json dataset between this bound and place marker
        placeBoundPullMarker(map,bounds);        
    });

    google.maps.event.addListener(map, 'click', function(event) {
        var newPullMarker = new Pull.Marker({map: map, latLng: event.latLng});

        panel.open(newPullMarker);
    });

    google.maps.event.addListener(map, 'dragend', function() {
        var center = map.getCenter();

        if (strictBounds.contains(center)) {
            return;
        }
        
        var x = center.lng(),
            y = center.lat(),
            maxX = strictBounds.getNorthEast().lng(),
            maxY = strictBounds.getNorthEast().lat(),
            minX = strictBounds.getSouthWest().lng(),
            minY = strictBounds.getSouthWest().lat();

        if (x < minX) x = minX;
        if (x > maxX) x = maxX;
        if (y < minY) y = minY;
        if (y > maxY) y = maxY;

        map.setCenter(new google.maps.LatLng(y, x));
    });

    google.maps.event.addListener(map, 'zoom_changed', function() {
  
        if (map.getZoom() < minZoomLevel) {
            map.setZoom(minZoomLevel);
        }
    });
    
})();