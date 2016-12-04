// Code for just the media player here

// media player needs to be resized on initialization otherwise it goes offscreen
$("video.media-player").height(window.innerHeight - 5);

$(window).resize(function(){
    $("video.media-player").height(window.innerHeight - 5);
});

