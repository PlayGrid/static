
$(document).ready(function(){
    // set the origin to "*" if running on test or local
    var origin = window.location.origin;
    var testing = origin.search('rawgit');
    var send_origin = testing ? "*" : origin;
    var receive_origin = testing ? null : origin;

    // Call the API when a button is pressed
    $('#video').on('click', function() {
        vimeoPlayer.api('play');
        if (typeof ga != 'undefined')
            ga('send', 'event', 'videos', 'play', 'Trailer01');
        $('#video').hide();
        $('#player-wrapper').show()
    });
    
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


