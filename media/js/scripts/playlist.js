var musicData = [];
var videoData = [];
var musieTable;
var videoTable;

function initPlaylistData() {
   
   // integrity check 
   if (localStorage.getItem("Group7IntegrityCheck") == null) {
        localStorage.clear();
        localStorage.setItem("Playlist", '{"music":[], "video":[]}');
        localStorage.setItem("Group7IntegrityCheck", "true");
   }
   
}

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


$(document).ready(function(){
	console.log('document.ready()');
    initPlaylistData();
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
        var playlist = JSON.parse(localStorage.getItem("Playlist"));
        var input = $("#input-music-playlist").val();
        var musicArray = [];
        for (var i = 0; i < playlist.music.length; i++) {
            musicArray.push(playlist.music[i].title);
        }
        if ((musicArray.length > 0) && musicArray.indexOf(input) > -1){
            $("#error-p").remove();
            $("#modal-add-music-playlist div.modal-div p").append("<p id='error-p' style='color:red;'>That video playlist name exists</p>");
        }else {

            // remove any errors
            $("#error-p").remove();
            playlist.music.push({
                "title" : input
            });

            // trigger close
            window.location.hash = "#close";
        }
        playlist = JSON.stringify(playlist);
        localStorage.setItem("Playlist", playlist);
        
    })
});

$(window).resize(function(){
    $("video.media-player").height(window.innerHeight - 5);
});

 

