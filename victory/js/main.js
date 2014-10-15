var $adminMenu = $('#admin-menu');
var $menuFixed = $('#menu-fixed');
var $hidden = true;

$(document).ready(function(){
	$('#video').on('click', function() {
		$('#video .watch').hide();
		loadVideo();
	});

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
    	}, 2000);
    });
})

// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function loadVideo() {
	var video = $('#video');
	player = new YT.Player('player', {
	  height: video.height(),
	  width: video.width(),
	  videoId: 'ZD9fWUUeL00',
	  events: {
	    'onReady': onPlayerReady,
	    'onStateChange': onPlayerStateChange
	  }
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		$('#player').remove();
		$('#video .watch').show();
		$('#video').append('<div id="player"></div>');
	}

}
