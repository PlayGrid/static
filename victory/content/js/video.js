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