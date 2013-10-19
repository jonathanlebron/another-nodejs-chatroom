var express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = process.env.PORT || 8080,
    users = [],
    id = 1;

app.configure(function () {
    app.set('port', port);
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

io.set('log level', 2);

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: "has joined the chat!" });

    socket.on('sendMessage', function (data) {
        socket.emit('message', data);
    });

    socket.on('setUsername', function (data) {
        if (users.indexOf(data) == -1) { // Check if username is taken
            socket.set('username', data, function(){
                users.push(data);
                socket.emit('setUsernameStatus', 'ok');
                console.log("user " + data + " connected");
            });
        } else {
            socket.emit('setUsernameStatus', 'error') // Send the error
        }
    });

    socket.on('disconnect', function (data) {
        socket.emit('disconnect', data);
    });

    //id++;
});

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});