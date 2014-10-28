var $adminMenu = $('.navbar');
var $menuFixed = $('#menu-fixed');
var $applyModal = $('#apply-modal');
var $hidden = true;

	
$(document).ready(function(){
	var adminMenuBaseHeight = $adminMenu.height();

	// set the origin to "*" if running on test or local
    var origin = window.location.origin;
	var testing = origin.search('file://') > -1 || origin.search('test.playgrid.com') > -1 || origin.search('local.playgrid.com') > -1;
	var send_origin = testing ? "*" : origin;
	var receive_origin = testing ? null : origin;
	var aboutOffset;

    // handle top menu on scroll
	$(window).scroll(function(){
        if ($(this).scrollTop() > 200) {
        	if($hidden){
	        	clearTimeout($adminMenu.t);
	        	$menuFixed.t = setTimeout((function() {
	                $menuFixed.stop().fadeIn(500);
	            }), 200);
	            $adminMenu.stop().animate({
	            	maxHeight: '85px',
	            	height: '85px'
	            }, 500);
	            $hidden = false;
            }
        } else {
        	if(!$hidden){
	        	clearTimeout($menuFixed.t);
	        	$adminMenu.t = setTimeout((function() {
	        		$adminMenu.stop().animate({
			        	maxHeight: adminMenuBaseHeight+'px',
		    	    	height: adminMenuBaseHeight+'px'
		        	}, 500);
	        	}), 200)
	            $menuFixed.stop().fadeOut(500);
	            $hidden = true;
	        }
        }
    });

    // handle nav menu scroll links
    $('.scroll').on('click', function(e){
        e.preventDefault();
        var pos;
        switch($(this).data('scroll')) {
        	case 'about':
        		pos = aboutOffset;
        		break;
        	case 'menu':
        		pos = 0;
        		break;
        }
        $('html, body').animate({scrollTop: pos}, 200);
    });


	// listen for events from the iframe
	window.addEventListener( "message",
		function (e) {
			if(!receive_origin || e.origin == receive_origin) {
				var data = e.data.data;
				switch(e.data.message) {
					case 'content_height_change':
						var height = data;
						$("#content-home").height(height);
						break;
					case 'about_offset_change':
						aboutOffset = data;
						break;
				}
			}
	  	},
	false);


    // Beta signup form ajax
    $('#earlyAccess').submit(function (event) {
        /* stop form from submitting normally */
        event.preventDefault();

        var url = getQueryParameter('apply_url') || "http://api.playgrid.com/api/2.1/players/apply/";
        var token = $("#earlyAccess").attr("data-token");
        var request = $.ajax({
            type: "POST",
            url: url,
            data: {email: $('#email').val(), note: $('#note').val()},
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