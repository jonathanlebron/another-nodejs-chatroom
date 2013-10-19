$(document).ready(function() {
    var socket = io.connect('http://localhost:8080'),
        chat = $('#chat'),
        text = $('#text'),
        username = $('#username'),
        users = $('#users');

    $('#usernameModal').modal('show');

    socket.on('message', function (data) {
        if(data.message) {
            addMessage(data.message, data.username, new Date().toISOString(), data.sender);
        } else
            console.log("There is a problem sending message:", data);
    });

    socket.on('setUsernameStatus', function (data) {
        if (data.codeStatus == 'ok') {
            addUser(data.username);

            $('#usernameModal').modal('hide');
            $('#usernameError').html("");
        } else {
            $('#usernameError').html("That username is already taken!");
        }
    });

    socket.on('addUser', function (data) {
        if (data.username)
            addUser(data.username);
    });

    socket.on('loadUsers', function (data) {
        if (data){
            for (var i = 0; i < data.length; i++)
                addUser(data[i]);
        }
    });

    $('#text').on('keydown', function(e){
        var key = e.which || e.keyCode;
        if(key == 13)
            sendMessage();
    });

    $('#sendButton').on('click', function(){
        sendMessage();
    });

    $('#saveUsername').on('click', function(){
    	if ( username.val() ){
    		socket.emit('setUsername', { username: username.val() });
            $('#usernameError').html("");
    	} else {
            $('#usernameError').html("Can't leave username blank!");
        }
    });

    function addMessage(msg, user, date, sender) {
        var html = "";
        var classDiv = "message " + sender;

        html += '<div class="'+classDiv+'">';
        if (user)
            html += '<b class="username">' + user + ': </b>';
        html += '<p class="messageText">' + msg + '</p>';
        html += '</div>';

        chat.append(html);
        chat.scrollTop(chat[0].scrollHeight);
    }

    function sendMessage() {
        if ( text.val() ){
            socket.emit('sendMessage', { username: username.val(), message: text.val(), sender: '' });
            addMessage(text.val(), "Me", new Date().toISOString(), "self");
            text.val('');
        }
    }

    function addUser(username) {
        var html = '';
        html += '<div class="user">';
        html += '<p class="messageText">' + username + '</p>';
        html += '</div>';

        users.append(html);
    }
});
