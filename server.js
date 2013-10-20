var express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = process.env.PORT || 8080,
    users = ['admin'];

app.configure(function () {
    app.set('port', port);
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

io.set('log level', 2);

io.sockets.on('connection', function (socket) {
    socket.emit('loadUsers', users);

    socket.on('sendMessage', function (data) {
        socket.broadcast.emit('message', data);
    });

    socket.on('setUsername', function (data) {
        if (users.indexOf(data.username) == -1) { // Check if username is taken
            socket.set('username', data.username, function(){
                users.push(data.username);
                socket.emit('setUsernameStatus', { codeStatus: 'ok', username: data.username});
                socket.broadcast.emit('addUser', { username: data.username });
                socket.broadcast.emit('message', { message: data.username + " has joined the chat!", sender: 'server' });
                console.log("user " + data.username + " connected");
            });
        } else {
            socket.emit('setUsernameStatus', { codeStatus: 'error'}); // Send the error
            console.log("username " + data.username + " already taken!");
        }
    });

    socket.on('disconnect', function (data) {
        socket.get('username', function(err, name) {
            if (name && ~users.indexOf(name)) {
                users.splice(users.indexOf(name), 1);
                socket.broadcast.emit('removeUser', { username: name });
                socket.broadcast.emit('message', { message: name + " has left the chat!", sender: 'server' });
            }
        });
    });
});

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});