var SECONDS = 1000;
var MINUTES = 60*1000;
var HOURS = 60*MINUTES;
var DAYS = 24*HOURS;
var playtest_duration = $('#countdown').data('duration')*HOURS || 1*HOURS;
var playtest_ends = null;
var next_playtest = null;	
var playtest_in_progress = false;
var playtest_clock = null;
var $countdown = $('#countdown');
var $countdown_wrapper = $('#countdown-wrapper');

var page_load_date = new Date();
var page_load_time = Date.now();

var playtest_schedule = [];
//var playtest_schedule = [new Date(page_load_time+(65*SECONDS)).toString(), new Date(page_load_time+(5*DAYS)).toString()];

function setInProgressMode() {
	setTimeout(function() {
		$countdown_wrapper.html('<h2 class="in-progress">PLAY TEST IN PROGRESS</h2>');
		$countdown_wrapper.append('<p class="in-progress"><strong>Press PLAY to join</strong></p>');
		if(playtest_ends) {
			var ends = new Date(playtest_ends);
			ends = stripSecondsFromLocaleTimeString(ends.toLocaleTimeString());
			$countdown_wrapper.append('<p class="in-progress"><small>This play test ends at ' + ends + ' (local time)</small></p>');
		}
		$countdown_wrapper.hide().delay(500).fadeIn({duration: 1200});
	}, 2000);
	if(playtest_clock) 
		playtest_clock.stop();
}

function intervalCallback() {
	if(playtest_clock.getTime() < 0) {
		initCountdown();
	}
}

function sendError(message, metadata) {
	$.ajax({
		type: "POST",
		url: 'http://api.playgrid.com/api/2_1/error/',
		headers: {'Authorization': 'PGP df9ce5665ab653abc77e4987e253b897a40c7180'},
		data: {application: 'Victory Launcher',
			   message: message,
			   context: metadata}
	});
}

function initBlink() {
	$('.blink').each(function() {
	    var elem = $(this);
	    setInterval(function() {
	        if (elem.css('visibility') == 'hidden') {
	            elem.css('visibility', 'visible');
	        } else {
	            elem.css('visibility', 'hidden');
	        }    
	    }, 500);
	});
}

function addBlinkingText() {
	$countdown_wrapper.append('<div><h4 class="next-playtest warning">A Play Test is <u class="blink">NOT</u> in progress.</h4></div>');
	initBlink();
}

function stripSecondsFromLocaleTimeString(time_str) {
	return time_str.replace("‎:‎00‎ ‎PM", " PM");
}

function initCountdown() {
	var now_date = new Date();
	var now = Date.now();
	var playtest = null;
	var next_playtest_str;

	$countdown.empty();
	$(".in-progress").remove();
	$(".next-playtest").remove();

	next_playtest = null;
	playtest_in_progress = false;
	for(var i=0; i<playtest_schedule.length; i++) {
		playtest = Date.parse(playtest_schedule[i]);
		if(playtest-now > 1*MINUTES) {
			if(!playtest_in_progress) {
				next_playtest = playtest;
				next_playtest_str = playtest_schedule[i];
				break;
			}
		} else {
			playtest_in_progress = playtest_in_progress || now-playtest_duration < playtest; // check if playtest is in progress
			if(playtest_in_progress) {
				playtest_ends = playtest + playtest_duration;
			}
		}
	}

	if(next_playtest) {
		var time_left = next_playtest - now;
		playtest_clock = playtest_clock || new FlipClock($countdown, {
			clockFace:"DailyCounter",
			autoStart:false,
			callbacks:{interval:intervalCallback}
		});
		playtest_clock.setTime(time_left/1000);
		playtest_clock.setCountdown(true);
		playtest_clock.start();
		var d = new Date(next_playtest);
		var date_str = d.toLocaleDateString();
		if(date_str == now_date.toLocaleDateString()) {
			date_str = "today";
		} else {
			date_str = "on " + date_str;
		}
		var time = d.toLocaleTimeString();
		time = stripSecondsFromLocaleTimeString(time);
		next_playtest_str = date_str + " at " + time;
		// add blinking text
		addBlinkingText();
		$countdown_wrapper.append('<div><h4 class="next-playtest">Next play test starts ' + next_playtest_str + ' (local time)</h4></div>');

	} else if(playtest_in_progress) {
		setInProgressMode();
	} else {
		addBlinkingText();
	}
}

$(document).ready(function(){

	$('body').css('background-image', 'url("'+site_static+'img/launcher/launcher'+page_load_time%19+'.jpg")');

	// get schedule from document
	if(playtest_schedule.length == 0) {
		var $dates = $('#playtest-schedule').children();
		$dates.each(function() {
			playtest_schedule.push($(this).html());
		});		
	}
                  
    // get schedule from atom feed & append
    var feed_url = $('#countdown-wrapper').data('feed-url')
    if (feed_url) {
        $.get(feed_url, function(data) {
            $(data).find("entry summary").each(function() {
                var $this = $(this);
                playtest_schedule.push($(this).html());
                });
            }).always(function() {
                setTimeout(initCountdown, 500);
            });
    } else {
        setTimeout(initCountdown, 500);
    }


	setTimeout(function(){
	   window.location.reload(1);
	}, 1000*60*60);
});
