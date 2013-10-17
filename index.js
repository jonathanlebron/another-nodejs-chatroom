var express = require("express");
var app = express();
var port = 3700;

app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.engine("jade", require("jade").__express);

app.get("/", function(req, res){
	res.render("index");
});

app.use(express.static(__dirname + "/public"));

var io = require("socket.io").listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on("connection", function (socket) {
	socket.emit("message", { message: "Welcome to the chat young grasshoper..." });
	socket.on("send", function (data) {
		io.sockets.emit("message", data);
	});
});