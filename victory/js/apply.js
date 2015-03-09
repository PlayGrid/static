var victory_campaign;

$(document).ready(function(){

    // determine campaign & save to local storage
    var referrer;
    if(Modernizr.localstorage) {
    	referrer = localStorage.getItem("referrer") || document.referrer || 'direct';
    	localStorage.setItem("referrer", referrer); // save referrer off in case the user navigates around
    } else {
    	referrer = document.referrer || 'direct';
    }

    victory_campaign = getQueryParameter('campaign') || location.href;


    // Beta signup form ajax
    $('#earlyAccess').submit(function (event) {
        /* stop form from submitting normally */
        event.preventDefault();

        var url = getQueryParameter('apply_url') || "http://api.playgrid.com/api/2.1/players/apply/";
        var token = $("#earlyAccess").attr("data-token");
        var request = $.ajax({
            type: "POST",
            url: url,
            data: {
            	email: $('#email').val(), 
            	campaign: victory_campaign + " (" + referrer + ')'},
            headers: {Authorization: token},
            dataType: 'json'
        });

        request.done(function( msg ) {
            $("#earlyAccess .errors").empty();
            $('#apply-modal').modal('hide');
            $('#messages .thanks').remove();
            $('#messages').append('<div class="thanks alert alert-success" style="display:none" role="alert">Thanks for applying!</div>');
            $('#messages .thanks').slideDown().delay(5000).slideUp();
            ga('send', 'pageview', {'page': '/vpv/apply/success/', 'title': 'Apply Success'});
            mixpanel.track("Apply Success");
        });
 
        request.fail(function( jqXHR, textStatus ) {
            var message = "foo";
            for(var key in jqXHR.responseJSON) {
                $("#earlyAccess .errors").append("<p>"+jqXHR.responseJSON[key]+"</p>");
            }
            ga('send', 'pageview', {'page': '/vpv/apply/error/', 'title': 'Apply Errors'});
            mixpanel.track("Apply Error");
        });
    });
});