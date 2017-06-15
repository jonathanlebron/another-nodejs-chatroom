var express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    connections = {};
    usernames = new Set();

app.set('port', process.env.PORT || 5000);
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on('connection', function(socket) {
    connections[socket.id] = {socket: socket}
    socket.emit('loadUsers', Array.from(usernames));

    socket.on('sendMessage', function(data) {
        socket.broadcast.emit('message', data);
        console.log(data.username + " says: " + data.message);
    });

    socket.on('setUsername', function (data) {
        if (usernames.has(data.username)) { // Check if username is taken
            socket.emit('setUsernameStatus', {codeStatus: 'error'}); // Send the error
            console.log("username " + data.username + " already taken!");
        } else {
            connections[socket.id].username = data.username;
            usernames.add(data.username);
            socket.emit('setUsernameStatus', {codeStatus: 'ok', username: data.username});
            socket.broadcast.emit('addUser', {username: data.username});
            socket.broadcast.emit('message', {
                message: data.username + " has joined the chat!",
                sender: 'server'
            });
            console.log("user " + data.username + " connected");
        }
    });

    socket.on('disconnect', function (data) {
        if(connections[socket.id].username) {
            username = connections[socket.id].username
            usernames.delete(username);
            socket.broadcast.emit('removeUser', {username: username});
            socket.broadcast.emit('message', {
                message: username + " has left the chat!",
                sender: 'server'
            });
            console.log("username " + username + " disconnected");
        }
    });
});

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
