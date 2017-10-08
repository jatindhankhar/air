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
            geocomplete();
        } else {
            switch_textboxes(false);
        }

    });

});


$("#target").submit(
    function(ev) {
        ev.preventDefault();
        //send an ajax request to our action
        search_text = $("#search-text").val().trim();
        search_category = $('#search-button').text().trim().toLowerCase();
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
                    alert("Done");
                    alert(data);
                    print_raw_json(data);
                    console.log(data);
                }
            });
        } else {
            console.log("City lookup..");
        }
    }
);

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
    map = L.mapbox.map('map-container', 'mapbox.streets')
        .setView([lat, lng], 10);

    add_marker_to_map(lat, lng);


}

function change_map_location(lat, lng) {

    map.flyTo([lat, lng], 10, {
        animate: true,
        duration: 5,
        easeLinearity: 1
    });

}

function switch_textboxes(location) {
    if (location) {
        $("#search-text").hide();
        $("#location-text").show();
    } else {
        $("#search-text").show();
        $("#location-text").hide();
    }
}

function geocomplete() {

    $("#location-text")
        .geocomplete()
        .bind("geocode:result", function(event, result) {

            location = result.geometry.location.toString();
            lat, lng = location;
            change_map_location(lat, lng);

        })
};