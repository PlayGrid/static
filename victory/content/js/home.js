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
    
    // detect content height changes and post to parent
    var prevHeight = $('#content').height();
    var prevAboutOffset = $('#about').offset().top;
    postMessage("content_height_change", prevHeight, send_origin);
    $( window ).resize(function() {
        var curHeight = $("#content").height();            
        if (prevHeight !== curHeight) {
            postMessage("content_height_change", curHeight, send_origin);
            prevHeight = curHeight;
        }                 
        var curAboutOffset = $('#about').offset().top;           
        if (prevAboutOffset !== curAboutOffset) {
            postMessage("about_offset_change", curAboutOffset, send_origin);
            prevAboutOffset = curAboutOffset;
        }            
    });


    // listen for messages from parent 
    window.addEventListener( "message",
        function (e) {
            if(!receive_origin || e.origin == receive_origin) {
                var data = e.data.data;
                switch(e.data.message) {
                    case 'apply':
                        $applyModal.modal('show');
                        break;
                }
            }
        }, 
    false);
})


