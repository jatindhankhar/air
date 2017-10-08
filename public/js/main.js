// Global Map
var map;

//Try HTML5 geolocation.
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        console.log(pos);
        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        //infoWindow.open(map);
        //map.setCenter(pos);
        init_map(pos["lat"], pos["lng"]);
    }, function() {
        //handleLocationError(true, infoWindow, map.getCenter());
    });
} else {
    // Browser doesn't support Geolocation
    //handleLocationError(false, infoWindow, map.getCenter());
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    //infoWindow.setPosition(pos);
    //infoWindow.setContent(browserHasGeolocation ?
    //   'Error: The Geolocation service failed.' :
    //  'Error: Your browser doesn\'t support geolocation.');
    //infoWindow.open(map);
}


$(function() {

    $(".dropdown-menu a").click(function() {

        console.log($(this).children());
        $('#search-button').html($(this).children().html())
        search_category = $('#search-button').text().trim().toLowerCase();
        if (search_category == "city") {
            switch_textboxes(true);
            remove_progess();
            geocomplete();
        } else {
            switch_textboxes(false);
        }

    });

});

function show_progress(refresh_state) {
    if (refresh_state) {
        $("#raw-json").hide();
        $("#refresh-icon").show();
    } else {
        $("#raw-json").fadeOut("slow").show();
        $("#refresh-icon").fadeIn("slow").hide();
    }
}

function remove_progess() {
    $("#raw-json").hide();
    $("#refresh-icon").hide();
}

$("#target").submit(
    function(ev) {
        ev.preventDefault();
        //send an ajax request to our action
        search_text = $("#search-text").val().trim();
        search_category = $('#search-button').text().trim().toLowerCase();
        show_progress(true);
        // Send ajax if city is not required
        if (search_category != "city") {
            $.ajax({
                method: "POST",
                url: "/search",
                //serialize the form and use it as data for our ajax request
                data: { 'search-text': search_text, 'search-category': search_category },
                //the type of data we are expecting back from server, could be json too
                dataType: "json",
                success: function(data) {
                    //if our ajax request is successful, replace the content of our viz div with the response data
                    show_progress(false);
                    //print_raw_json(data);
                    handle_json(data, search_category)

                }
            });
        } else {
            console.log("City lookup..");
        }
    }
);

function handle_json(data, search_category) {
    if (search_category === "airport") {
        print_raw_json(data);
        if ("AirportInfoResult" in data && ("longitude" in data["AirportInfoResult"] && "latitude" in data["AirportInfoResult"])) {
            zoom_to_airport(data["AirportInfoResult"]["latitude"], data["AirportInfoResult"]["longitude"])
        }
    } else if (search_category === "flight") {
        print_raw_json(data);
    }

}

function print_raw_json(data) {
    $('#raw-json').text(JSON.stringify(data, null, 4));
}

function add_marker_to_map(lat, lng) {

    L.marker([lat, lng], {
        title: "Location"
    }).addTo(map);

}

function init_map(lat, lng) {
    L.mapbox.accessToken = 'pk.eyJ1IjoiamF0aW5kaGFua2hhciIsImEiOiJjajhnN3B6azUwOWIyMzJuNmNvMWlsbXg0In0.8hqJ0HFxyROInUXSN6h5KQ';
    map = L.mapbox.map('map-container', 'mapbox.streets', 'map-popups', 'mapbox.light')
        .setView([lat, lng], 10);

    add_marker_to_map(lat, lng);


}

function change_map_location(lat, lng) {

    map.flyTo([lat, lng], 14, {
        animate: true,
        duration: 3,
        easeLinearity: 0.1
    });

}

function switch_textboxes(show_geocode) {
    if (show_geocode) {
        $("#search-text").hide();
        $("#location-text").show();
    } else {
        $("#search-text").show();
        $("#location-text").hide();
    }
}

function zoom_to_airport(lat, lng) {
    lat = parseFloat(lat)
    lng = parseFloat(lng)
    map.flyTo([lat, lng], 16, {
        animate: true,
        duration: 3,
        easeLinearity: 0.1
    });
}

function geocomplete() {

    $("#location-text")
        .geocomplete()
        .bind("geocode:result", function(event, result) {

            res = result.geometry.location.toJSON();
            console.log(res);
            change_map_location(res["lat"], res["lng"]);
            add_marker_to_map(res["lat"], res["lng"]);
            fetchYelpData(res["lat"], res["lng"])
        })
};

function flattenToString(obj) {
    var key, array = []
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            array.push(obj[key])
        }
    }
    return array.join(',')

}

function yelpToGeoJson(data) {
    var geo_json = []
    if ('businesses' in data) {
        for (business of data['businesses']) {
            console.table(business);
            el = {}
            el['type'] = "Feature"

            geometry = {}
            geometry['type'] = "Point"
            console.log("Coordinates");
            console.log(business["coordinates"])
            geometry['coordinates'] = [business["coordinates"]["longitude"], business["coordinates"]["latitude"]]
            prop = {}
            prop['title'] = business['name']
            prop['description'] = flattenToString(business['location'])
            prop['marker-color'] = '#000000'
            prop['marker-size'] = 'large'
            business_type = business['categories'][0]['title'].toLowerCase()
            if (business_type.includes("wine") || business_type.includes("bar"))
                prop['marker-symbol'] = 'bar'
            else if (business_type.includes("restaurant") || business_type.includes("food"))
                prop['marker-symbol'] = 'restaurant'
            else if (business_type.includes("park"))
                prop['marker-symbol'] = 'park'
            else
                prop['marker-symbol'] = 'rocket'
            prop['image'] = business['image_url']
            prop['stars'] = business['rating']
            el['geometry'] = geometry
            el['properties'] = prop

            geo_json.push(el)
        }
    }
    return geo_json
}

function addMarkerstoMap(data) {
    console.log(data);
    geojson = yelpToGeoJson(data)
    var myLayer = L.mapbox.featureLayer().addTo(map);
    myLayer.on('layeradd', function(e) {
        var marker = e.layer;
        var feature = marker.feature;
        var image = feature.properties.image
        var stars = feature.properties.stars
        var slideshowContent;



        //slideshowContent = '<div class="img-responsive">' +
        //   '<img src="' + image + '" />' +
        //  '</div>';

        slideshowContent = '<img class="img-responsive center-block" src="' + image + '" width="250px" height="250px"/>'



        // Create custom popup content
        var popupContent = '<div class="popup text-center" style="border-color: #a29a9a;border-width: 3px;border-style: groove;"> ' +
            '<h2>' + feature.properties.title + '</h2>' + '<br>' + '<h2>' +
            stars + '<i class="fa fa-star fa-2x fa-spin" style="color: yellow;"> </i>' + '</h2>' +
            slideshowContent +
            '</div>';

        // http://leafletjs.com/reference.html#popup
        marker.bindPopup(popupContent, {
            closeButton: false,
            minWidth: 320
        });
    });

    myLayer.setGeoJSON(geojson);


}

function fetchYelpData(lat_q, lng_q) {
    $.ajax({
        method: "POST",
        url: "/yelp",
        //serialize the form and use it as data for our ajax request
        data: { 'lat': lat_q, 'lng': lng_q },
        //the type of data we are expecting back from server, could be json too
        dataType: "json",
        success: function(data) {
            //if our ajax request is successful, replace the content of our viz div with the response data
            addMarkerstoMap(data);

        }
    });
}