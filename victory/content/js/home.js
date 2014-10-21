var $applyModal = $('#apply-modal');
var vimeoPlayer = $f($('#vimeoplayer')[0]);

$(document).ready(function(){
    // set the origin to "*" if running on test or local
    var origin = window.location.origin;
    var testing = origin.search('rawgit');
    var send_origin = testing ? "*" : origin;
    var receive_origin = testing ? null : origin;

    // When the player is ready, add listeners for pause, finish, and playProgress
    vimeoPlayer.addEvent('ready', function() {
        $('.watch').show();
        vimeoPlayer.addEvent('finish', onFinish);
    });

    // Call the API when a button is pressed
    $('#video').on('click', function() {
    	vimeoPlayer.api('play');
    	if (typeof ga != 'undefined')
    		ga('send', 'event', 'videos', 'play', 'Trailer01');
    	$('#video').hide();
    	$('#player-wrapper').show()
    });

    function onFinish(id) {
        $('#video').show();
        $('#player-wrapper').hide()
    }



    $('.scroll').on('click', function(e){
    	e.preventDefault();
    	$('html, body').animate({
        	scrollTop: $("#"+$(this).data('scroll')).offset().top - 100
    	}, 200);
    });
    
    // detect content height changes and post to parent
    var prevHeight = $('#content').height();
    postMessage("content_height_change", prevHeight, send_origin);
    $( window ).resize(function() {
        var curHeight = $("#content").height();            
        if (prevHeight !== curHeight) {
            postMessage("content_height_change", curHeight, send_origin);
            prevHeight = curHeight;
        }            
    });


    // listen for messages from parent 
    window.addEventListener( "message",
        function (e) {
            if(e.origin == receive_origin) {
                var data = e.data.data;
                switch(e.data.message) {
                    case 'apply':
                        $applyModal.modal('show');
                        break;
                }
            }
        }, 
    false);



    // Beta signup form ajax
    $('#earlyAccess').submit(function (event) {
        /* stop form from submitting normally */
        event.preventDefault();

        var url = getQueryParameter('apply_url');
        if (url) {
            var request = $.ajax({
                type: "POST",
                url: url,
                data: {email: $('#email').val(), note: $('#note').val()},
                headers: {Authorization: "PGP {{ request.game.untrusted_access_token }}"},
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
        } else {
            $("#earlyAccess .errors").append("<p>beta form requires 'apply_url' provided as query param</p>");
        }
    });   
})


