var $adminMenu = $('#admin-menu');
var $menuFixed = $('#menu-fixed');
var $hidden = true;
	
$(document).ready(function(){
	var adminMenuBaseHeight = $adminMenu.height();

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

	// listen for events from the iframe
	window.addEventListener( "message",
		function (e) {
			if(e.origin == "null" || e.origin == window.location.origin) {
				var data = e.data.data;
				switch(e.data.message) {
					case 'content_height_change':
						var height = data;
						$("#content-home").height(height);
						break;
				}
			}
	  	},
	false);

	// send cta click message to iframe
	var win = document.getElementById("content-home").contentWindow;
	$("#floatingCTA").click(function(){
		var origin = window.location.origin != "file://" ? window.location.origin : "*";
		win.postMessage({message: "apply"}, origin);              
	});		
});		