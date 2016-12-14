// global vars
var playlist;
var musicData = [];
var videoData = [];
var musicTable;
var videoTable;
var confirmMessage = true;


function initPlaylistData() {

   // integrity check
   if (localStorage.getItem("Group7IntegrityCheck") == null) {
        localStorage.clear();
        localStorage.setItem("Playlist", '{"music":[], "video":[]}');
        localStorage.setItem("Group7IntegrityCheck", "true");
   }
   playlist = JSON.parse(localStorage.getItem("Playlist"));

}
initPlaylistData();

function initCatalogData() {
	console.log('initCatalogData()');

    musicData.push({"Track":'Lose yourself', "Album":'8 Miles', "Duration":'5:31',"Filename":'Eminem - Lose Yourself.mp3'});
	musicData.push({"Track":'Imagine', "Album":'John Lennon', "Duration":'3:03',"Filename":'John Lennon - Imagine.mp3'});
	musicData.push({"Track":'Lies', "Album":'Billy Talent', "Duration":'2:59',"Filename":'billy talent - Lies.mp3'});


	videoData.push({"Name":'Bunny with Butterfly', "Duration":'0:10', "Filename":'mov_bbb.mp4'});
	videoData.push({"Name":'Big Buck Bunny', "Duration":'1:00', "Filename":'big_buck_bunny.mp4'});
	videoData.push({"Name":'Pokemon Gotta Catch them All', "Duration":'2:50', "Filename":'Catchatronic -- Pokemon Gotta Catch them All Mix.mp4'});

        musicTable =  $("table.table.music-playlist").DataTable({
        "searching" : false,
        "lengthChange" : false,
        "pageLength" : 4,
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 2 ],
                "render": function ( data, type, row ) {
                    return  data + '<span mediaType="music" style="float:right;" class=" delete-file-button glyphicon glyphicon-minus"></span>';
                },
            }
        ],
        "columns" : [
        {"data": "Track"},
        {"data": "Album"},
        {"data": "Duration"},
		{"data": "Filename"},
        ],
        "drawCallback" : function(){
            deleteMusicHandler();
        }
        //"data" : musicData
	});

	videoTable =  $("table.table.video-playlist").DataTable({
        "columnDefs": [
            {
                "targets": [ 2 ],
                "visible": true
            },
            {
                "targets": [ 1 ],
                "render": function ( data, type, row ) {
                    return  data + '<span mediaType="video" style="float:right;" class=" delete-file-button glyphicon glyphicon-minus"></span>';
                },
            }
        ],
        "searching" : false,
        "lengthChange" : false,
        "pageLength" : 4,
        "order": [[ 0, "desc" ]],
        "columns" : [
        {"data": "Name"},
        {"data": "Duration"},
		{"data": "Filename"},
        ],
        "drawCallback" : function(){
            deleteMusicHandler();
        },
//        "data" : videoData
	});

    updatePlaylist("music", "update");
    updatePlaylist("video", "update");
}

// add event listener for deleting individual file in table
// we need to do this because of redraw
function deleteMusicHandler() {
   $("span.delete-file-button").on("click", function(){
       var type = $(this).attr("mediaType");
       var pl = playlist[type];
       var plTitle = $("#" + type + "-playlist-title").val();
       var name = $($(this).parent().parent().children()[0]).html();

       // find the playlist
       for (var i = 0; i < pl.length; i++) {
            if (plTitle == pl[i].title) {
                var files = pl[i].files
                for ( var j = 0; j < files.length; j++) {
                    if(type == "music"){
                        if(name == files[j].Track)
                            files.splice(j,1);
                    }
                    else if(type == "video"){
                        if(name == files[j].Name)
                            files.splice(j,1);
                    }
                }
            }
       }
       redrawTable(type, plTitle);
   });
}

// update the playlist table
function updatePlaylist(type, action, title) {

    var playlistTitle = $("#" + type + "-playlist-title");
    var files = playlist[type];

    if (action == "update") {

        // remove all options
        playlistTitle.empty();

        if (files.length == 0) {
            playlistTitle.append("<option>No Playlist</option>")
            var dataTable = $("#" + type +"-playlist-table").dataTable().api();
            dataTable.clear();
            dataTable.draw();
        }
        else {
            for (var i = files.length - 1; i > -1; i--) {
                playlistTitle.append("<option>" + files[i].title  + "</option>")
            }
            redrawTable(type, playlistTitle.val());
        }
    } else if (action == "delete") {

        for (var i = 0; i < files.length; i++ ) {
            var file = files[i];
            if (file.title == title)
               files.splice(i, 1);
        }

        // update playlist table on delete
        updatePlaylist(type, "update");
    }
}

$(document).ready(function(){
	console.log('document.ready()');
	initCatalogData();

    // get initial table width to save
    var tableWidth = $("#video-playlist-table").width();

	// hide the filename columns
	var column = videoTable.column(2);
    column.visible( false );
	column = musicTable.column(3);
	column.visible( false );

	videoTable.$(':eq(3)').addClass('selected');
	$('#video-playlist-table tbody').on( 'click', 'tr', function () {

//		$(this).toggleClass('selected');
//		console.log(this.cells[0].innerText);
        videoTable.$('tr.selected').removeClass('selected');
		musicTable.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
		var data = videoTable.row(this).data();
		console.log(data.Name + ' ' + data.Filename);
		loadVideo(data.Name, 'media/video/'+data.Filename);

	} );

	$('#music-playlist-table tbody').on( 'click', 'tr', function () {
		console.log('music list selected');

//		$(this).toggleClass('selected');
//		console.log(this.cells[0].innerText);

        videoTable.$('tr.selected').removeClass('selected');
        musicTable.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
		var data = musicTable.row(this).data();
		console.log(data.Track + ' ' + data.Filename);
		loadVideo(data.Track, 'media/music/'+data.Filename);
 	} );

    // on load update to fit into screen appropriately
    $('#media-video').height(window.innerHeight*0.50);

    // fullscreen table button
    $("#fullscreen-music-table-button").on("click", function(){
        $("td.player-section").toggle("slow");
        $("#video-playlist-section").toggle("slow");

        // set to new width
        $("div.main-container").toggleClass("table-fullscreen");

        // fullscreen table
        if ($("div.main-container").hasClass("table-fullscreen")) {
            $("#music-playlist-table").width(window.innerWidth-5)
            $("#fullscreen-music-table-button").attr("src", "media/images/min.png")
        } else {
            $("#music-playlist-table").width(tableWidth);
            $("#fullscreen-music-table-button").attr("src", "media/images/fullscreen.png")
        }
    });

    $("#fullscreen-video-table-button").on("click", function(){
        $("td.player-section").toggle("slow");
        $("#music-playlist-section").toggle("slow");

        // set to new width
        $("div.main-container").toggleClass("table-fullscreen");

        // fullscreen table
        if ($("div.main-container").hasClass("table-fullscreen")) {
            $("#video-playlist-table").width(window.innerWidth-5)
            $("#fullscreen-video-table-button").attr("src", "media/images/min.png")
        } else {
            $("#video-playlist-table").width(tableWidth);
            $("#fullscreen-video-table-button").attr("src", "media/images/fullscreen.png")
        }
    });

    // add playlist event-listener
    $("#save-music-playlist").on("click", function(){
        var input = $("#input-music-playlist").val();
        var musicArray = [];
        for (var i = 0; i < playlist.music.length; i++) {
            musicArray.push(playlist.music[i].title);
        }
        if ((musicArray.length > 0) && musicArray.indexOf(input) > -1){
            $("#error-p").remove();
            $("#modal-add-music-playlist div.modal-div p").append("<p id='error-p' style='color:red;'>That video playlist name exists</p>");
        } else {

            // remove any errors
            $("#error-p").remove();
            playlist.music.push({
                "title" : input
            });

            updatePlaylist("music", "update");

            // trigger close
            window.location.hash = "#close";
        }
    });

    // add playlist event-listener
    $("#save-video-playlist").on("click", function(){
        var input = $("#input-video-playlist").val();
        var videoArray = [];
        for (var i = 0; i < playlist.video.length; i++) {
            videoArray.push(playlist.video[i].title);
        }
        if ((videoArray.length > 0) && videoArray.indexOf(input) > -1){
            $("#error-p").remove();
            $("#modal-add-video-playlist div.modal-div p").append("<p id='error-p' style='color:red;'>That video playlist name exists</p>");
        } else {

            // remove any errors
            $("#error-p").remove();
            playlist.video.push({
                "title" : input
            });

            updatePlaylist("video", "update");

            // trigger close
            window.location.hash = "#close";
        }
    });
$("#delete-pmusic-without-confirm").on("click", function(){
    if ($('#pmusicconfirmbox').is(":checked")||$('#pvideoconfirmbox').is(":checked"))

        {

        document.getElementById("modal-confirm-delete-music-playlist").style.visibility="hidden";
            updatePlaylist("music", "delete", $("#music-playlist-title").val());
        }
    });


    $("#delete-music-playlist-yes").on("click", function(){
        updatePlaylist("music", "delete", $("#music-playlist-title").val());
    });

    // $("#delete-music-playlist").on("click", function(){
    //     updatePlaylist("music", "delete", $("#music-playlist-title").val());
    // });

    $("#delete-pvideo-without-confirm").on("click", function(){
    if ($('#pvideoconfirmbox').is(":checked")||$('#pmusicconfirmbox').is(":checked"))
        {

        document.getElementById("modal-confirm-delete-video-playlist").style.visibility="hidden";
            updatePlaylist("video", "delete", $("#video-playlist-title").val());
    }
    });

    $("#delete-video-playlist-yes").on("click", function(){
        updatePlaylist("video", "delete", $("#video-playlist-title").val());
    });

    $("#add-music-file-button").on("click", function(){
        var song = $("#input-add-music").val();
        var playlistTitle = $("#music-playlist-title").val();
        var musicplaylists = playlist.music;
        var errorSound = new Audio('media/sound/error.mp3');
        // trigger error message on fail
        if(song.endsWith('.txt')) {
           window.location.hash = "modal-error-music";
            errorSound.play();
        }   
        else {
            for (var i = 0; i < musicplaylists.length; i++ ){
               if (playlistTitle == musicplaylists[i].title) {
                    var files = musicplaylists[i].files;

                       // no songs
                       if (!files)
                            musicplaylists[i].files = [];
                       for(var j = 0; j < musicData.length; j++){
                           if (song.includes(musicData[j].Track))
                                musicplaylists[i].files.push(musicData[j]);
                       }
               }
            }
            // redraw playlist
            redrawTable("music", playlistTitle);
            window.location.hash = "close";
        }
    });

    $("#add-video-file-playslist").on("click", function(){
        var video = $("#input-add-video").val();
        var playlistTitle = $("#video-playlist-title").val();
        var videoplaylists = playlist.video;

        // trigger error message on fail
        if(video.endsWith('.txt'))
           window.location.hash = "modal-error-video";
        else {
            for (var i = 0; i < videoplaylists.length; i++ ){
               if (playlistTitle == videoplaylists[i].title) {
                    var files = videoplaylists[i].files;

                       // no songs
                       if (!files)
                            videoplaylists[i].files = [];
                       for(var j = 0; j < videoData.length; j++){
                           if (video.includes(videoData[j].Name))
                                videoplaylists[i].files.push(videoData[j]);
                       }
               }
            }
            // redraw playlist
            redrawTable("video", playlistTitle);
            window.location.hash = "close";
        }
    });


    // on playlist select
    $("#music-playlist-title").change(function(){
        var title = $(this).val();
        redrawTable("music", title);
    });

    // on playlist select
    $("#video-playlist-title").change(function(){
        var title = $(this).val();
        redrawTable("video", title);
    });

});

function redrawTable(type, title) {
    var datatable = $('#' + type + '-playlist-table').dataTable().api();

    // find the playlist
    for(var i =0; i < playlist[type].length; i ++){
        if(title == playlist[type][i].title){
            datatable.clear();

            // check undefined
            if (playlist[type][i].files)
                datatable.rows.add(playlist[type][i].files);
            datatable.draw();
        }
    }


}

$(window).resize(function(){
    $("video.media-player").height(window.innerHeight*0.50);
});

// when user leaves save data
window.onbeforeunload = function(){
        playlist = JSON.stringify(playlist);
        localStorage.setItem("Playlist", playlist);
}


