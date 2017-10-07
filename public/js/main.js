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
    });

});


$("#target").submit(
    function(ev) {
        ev.preventDefault();
        //send an ajax request to our action
        search_text = $("#search-text").val().trim();
        search_category = $('#search-button').text().trim().toLowerCase();
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

    }
);

function print_raw_json(data) {
    $('#raw-json').text(JSON.stringify(data, null, 4));
}

function init_map(lat, lng) {
    L.mapbox.accessToken = 'pk.eyJ1IjoiamF0aW5kaGFua2hhciIsImEiOiJjajhnN3B6azUwOWIyMzJuNmNvMWlsbXg0In0.8hqJ0HFxyROInUXSN6h5KQ';
    var map = L.mapbox.map('map-container', 'mapbox.streets')
        .setView([lat, lng], 10);

}