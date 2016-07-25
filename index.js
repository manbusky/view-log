
var filename = "/usr/local/tomcat/logs/fcareapi_response_log";

var spawn = require('child_process').spawn;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

http.listen(3000, function() { 
	console.log('Start log viewer server listening on *:3000');
});

io.on('connection', function(socket) {

	socket.emit("filename", filename);

	var tail = spawn("tail", ["-f", filename]);

	tail.stdout.on("data", function (data) {
		
		var newContent = data.toString('utf-8');

		socket.emit("content", newContent);

	});

	socket.on('disconnect', function() {

		console.log('user disconnected');
	});
});

