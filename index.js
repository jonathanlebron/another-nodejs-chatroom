var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = 8080;

server.listen(port);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.use(express.static(__dirname + '/public'));
app.use('/styles', express.static(__dirname + '/public/styles'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/images', express.static(__dirname + '/public/images'));

app.get('/', function(req, res){
	res.render('index');
});

io.set('log level', 2);

console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'Welcome to the chat young grasshoper...' });
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});