window.onload = function() {

	var messages = [];
	var socket = io.connect("http://localhost:3700");
	var field = document.getElementById("field");
	var sendButton = document.getElementById("sendButton");
	var chat = document.getElementById("chat");

	socket.on("message", function (data) {
		if (data.message) {
			messages.push(data.message);
			var html = "";
			for (var i=0; i<messages.length; i++) {
				html += messages[i] + "<br />";
			}
			chat.innerHTML = html;
		} else {
			console.log("There is a problem: ", data);
		}
	});

	sendButton.onclick = function() {
		var text = field.value;
		socket.emit("send", { message: text});
	};
}