
$(document).ready(function(){

    // determine campaign & save to local storage
    var campaign;
    var storedCampaign = Modernizr.localstorage ? localStorage.getItem("campaign") : null;
    campaign = getQueryParameter('campaign'); // query param is highest priority for setting campaign
    campaign = campaign || storedCampaign; // existing localStorage is second
    campaign = campaign || document.referrer; // referrer is third
    campaign = campaign || 'direct'; // finally, default to direct
    if(Modernizr.localstorage)
    	localStorage.setItem("campaign", campaign);
    campaign = "www.victory-command.com (" + campaign + ')';


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
            	note: $('#note').val(), 
            	campaign: campaign},
            headers: {Authorization: token},
            dataType: 'json'
        });

        request.done(function( msg ) {
            $("#earlyAccess .errors").empty();
            $('#apply-modal').modal('hide');
            $('#messages .thanks').remove();
            $('#messages').append('<div class="thanks alert alert-success" style="display:none" role="alert">Thanks for applying!</div>');
            $('#messages .thanks').slideDown().delay(5000).slideUp();
            ga('send', 'event', 'beta', 'signup', 'cta');
        });
 
        request.fail(function( jqXHR, textStatus ) {
            var message = "foo";
            for(var key in jqXHR.responseJSON) {
                $("#earlyAccess .errors").append("<p>"+jqXHR.responseJSON[key]+"</p>");
            }
        });
    });
});