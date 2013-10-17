$(document).ready(function() {
	var messages = [],
			socket = io.connect('http://localhost:8080'),
			chat = $('#chat'),
			username = $('#username'),
			text = $('#text');

	socket.on('message', function (data) {
		if(data.message) {
			messages.push(data);
			var html = '';
			for(var i=0; i<messages.length; i++) {
				html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
				html += messages[i].message + '<br />';
			}
			chat.html(html);
		} else
			console.log("There is a problem:", data);
	});

	$('#text').on('keydown', function(e){
		var key = e.which || e.keyCode;
		if(key == 13)
			handleMessage();
	});

	$('#sendButton').on('click', function(){
		handleMessage();
	});

	function handleMessage() {
		if( username.val() == "" )
			alert("Please type your name!");
		else {
			socket.emit('send', { message: text.val(), username: username.val() });
			text.val('');
		}
	}
});
