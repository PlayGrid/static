if(typeof $f != 'undefined')
    var vimeoPlayer = $f($('#vimeoplayer')[0]);
else
    var vimeoPlayer = null;

// When the player is ready, add listeners for pause, finish, and playProgress
if(vimeoPlayer != null) {
    vimeoPlayer.addEvent('ready', function() {
        $('.watch').show();
        vimeoPlayer.addEvent('finish', onFinish);
    });
}

function onFinish(id) {
    $('#video').show();
    $('#player-wrapper').hide()
}

$(document).ready(function(){

    // Call the API when a button is pressed
    $('#video').on('click', function() {
        vimeoPlayer.api('play');
        if (typeof ga != 'undefined')
            ga('send', 'event', 'videos', 'play', 'Trailer01');
        $('#video').hide();
        $('#player-wrapper').show()
    });
})
