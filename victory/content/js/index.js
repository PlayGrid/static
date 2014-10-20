 	
	
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
			        	maxHeight: '30px',
		    	    	height: '30px'
		        	}, 500);
	        	}), 200)
	            $menuFixed.stop().fadeOut(500);
	            $hidden = true;
	        }
        }
    });