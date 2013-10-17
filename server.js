var express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = process.env.PORT || 8080;

app.configure(function () {
    app.set('port', port);
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

io.set('log level', 2);

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Welcome to the chat young grasshoper...' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
  });
});

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});