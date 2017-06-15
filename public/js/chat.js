$(document).ready(function() {
    var socket = io.connect(),
        chat = $('#chat'),
        chatMessage = $('#chatMessage'),
        username = $('#username'),
        users = $('#users');

    $('#usernameModal').modal('show');

    /* Socket Events */
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
            chatMessage.focus();
        } else {
            $('#usernameError').html("That username is already taken!");
        }
    });

    socket.on('addUser', function (data) {
        if (data.username)
            addUser(data.username);
    });

    socket.on('removeUser', function (data) {
        if (data.username)
            removeUser(data.username);
    });

    socket.on('loadUsers', function (data) {
        console.log(data);
        if (!(Object.keys(data).length === 0 && data.constructor === Object)){
            data.forEach(function(username) {
                addUser(username);
            });
        }
    });

    /* Button Events */
    chatMessage.on('keydown', function(e){
        var key = e.which || e.keyCode;
        if(key == 13)
            sendMessage();
    });

    $('#username').on('keydown', function(e){
        var key = e.which || e.keyCode;
        if(key == 13)
            saveUsername();
    });

    $('#sendButton').on('click', function(){
        sendMessage();
    });

    $('#saveUsername').on('click', function(){
        saveUsername();
    });

    /* Helper Functions */
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
        if ( chatMessage.val() ){
            socket.emit('sendMessage', { username: username.val(), message: chatMessage.val(), sender: '' });
            addMessage(chatMessage.val(), "Me", new Date().toISOString(), "self");
            chatMessage.val('');
        }
    }

    function addUser(username) {
        var html = '';
        html += '<div class="user" id="'+username+'">';
        html += '<p class="messageText">' + username + '</p>';
        html += '</div>';

        users.append(html);
    }

    function removeUser(username) {
        $('#'+username).remove();
    }

    function saveUsername(){
        if ( username.val() ){
            socket.emit('setUsername', { username: username.val() });
            $('#usernameError').html("");
        } else {
            $('#usernameError').html("Can't leave username blank!");
        }
    }
});
