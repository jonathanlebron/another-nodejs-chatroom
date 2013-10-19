$(document).ready(function() {
    var messages = [],
        users = [],
        socket = io.connect('http://localhost:8080'),
        chat = $('#chat'),
        username = "Guest",
        text = $('#text');



    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<div class="message">'
                html += '<b class="username">' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += '<p class="messageText">' + messages[i].message + '</p>';
                html += '</div>';
            }
            chat.html(html);
            chat.scrollTop(chat[0].scrollHeight);
        } else
            console.log("There is a problem sending message:", data);
    });

    socket.on('addUser', function (data) {
    });

    $('#text').on('keydown', function(e){
        var key = e.which || e.keyCode;
        if(key == 13)
            handleMessage();
    });

    $('#sendButton').on('click', function(){
        handleMessage();
    });

    $('#settingsButton').on('click', function(){
    	var newUsername = prompt("Please enter your name", username);
    	if (newUsername){
    		username = newUsername;
    	}
    });

    function handleMessage() {
        if ( username && text.val() ){
            socket.emit('sendMessage', { username: username, message: text.val() });
            text.val('');
        }
    }
});
