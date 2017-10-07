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