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
    updatePlaylist("music", "update");

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
        "columns" : [
        {"data": "Track"},
        {"data": "Album"},
        {"data": "Duration"},
		{"data": "Filename"},
        ],
        "data" : musicData
	});

	videoTable =  $("table.table.video-playlist").DataTable({
        "columnDefs": [
            {
                "targets": [ 2 ],
                "visible": true
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
        "data" : videoData
	});
}

// update the playlist table
function updatePlaylist(type, action, title) {

    var playlistTitle = $("#" + type + "-playlist-title");
    var files = playlist[type];

    if (action == "update") {

        // remove all options
        playlistTitle.empty();

        if (files.length == 0)
            playlistTitle.append("<option>No Playlist</option>")
        else {
            for (var i = files.length - 1; i > -1; i--) {
                playlistTitle.append("<option>" + files[i].title  + "</option>")
            }
        }
    } else if (action == "delete") {

        for (var i = 0; i < files.length; i++ ) {
            var file = files[i];
            if (file.title == title)
               files.splice(i, 1);
        }

        // update playlist table on delete
        updatePlaylist(type, "update")
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
    $('#media-video').height(window.innerHeight -5);

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
$("#delete-without-confirm").on("click", function(){
    if ($('#confirmbox').is(":checked"))
        {updatePlaylist("music", "delete", $("#music-playlist-title").val());}
    });


    $("#delete-music-playlist-yes").on("click", function(){
        updatePlaylist("music", "delete", $("#music-playlist-title").val());
        document.getElementById("modal-confirm-delete").style.visibility="hidden";
    });

    $("#delete-music-playlist-no").on("click", function(){
        document.getElementById("modal-confirm-delete").style.visibility="hidden";
    });

    $("#delete-music-playlist").on("click", function(){
        updatePlaylist("music", "delete", $("#music-playlist-title").val());
    });

    $("#delete-video-playlist").on("click", function(){
        updatePlaylist("video", "delete", $("#video-playlist-title").val());
    });


    $("#add-music-button").on("click", function(){

    })
});

$(window).resize(function(){
    $("video.media-player").height(window.innerHeight - 5);
});

// when user leaves save data
window.onbeforeunload = function(){
        playlist = JSON.stringify(playlist);
        localStorage.setItem("Playlist", playlist);
}


