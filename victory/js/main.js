var $adminMenu = $('#navbar');
var $menuFixed = $('#menu-fixed');
var $hidden = true;

$(document).ready(function(){
	
    var iframe = $('#vimeoplayer')[0];
    var player = $f(iframe);

    // When the player is ready, add listeners for pause, finish, and playProgress
    player.addEvent('ready', function() {
    	$('.watch').show();
        player.addEvent('finish', onFinish);
    });

    // Call the API when a button is pressed
    $('#video').on('click', function() {
    	player.api('play');
    	if (typeof ga != 'undefined')
    		ga('send', 'event', 'videos', 'play', 'Trailer01');
    	$('#video').hide();
    	$('#player-wrapper').show()
    });

    function onFinish(id) {
        $('#video').show();
        $('#player-wrapper').hide()
    }
	
	

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
			        	maxHeight: '30px',
		    	    	height: '30px'
		        	}, 500);
	        	}), 200)
	            $menuFixed.stop().fadeOut(500);
	            $hidden = true;
	        }
        }
    });

    $('.scroll').on('click', function(e){
    	e.preventDefault();
    	$('html, body').animate({
        	scrollTop: $("#"+$(this).data('scroll')).offset().top - 100
    	}, 200);
    });
})


