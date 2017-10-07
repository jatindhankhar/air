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
        $.ajax({
            method: "POST",
            url: "/search",
            //serialize the form and use it as data for our ajax request
            data: { 'yolo': 'polo' },
            //the type of data we are expecting back from server, could be json too
            dataType: "json",
            success: function(data) {
                //if our ajax request is successful, replace the content of our viz div with the response data
                alert("Done");
                alert(data);
                console.log(data);
            }
        });

    }
);