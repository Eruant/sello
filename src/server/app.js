/*globals require, process, console */

var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	port = process.env.PORT || 5000,
	io = require('socket.io'),
	socket;

http.createServer(function (req, res) {
	'use strict';

	var uri = 'bin/' + url.parse(req.url).pathname,
		filename = path.join(process.cwd(), uri);

	path.exists(filename, function (exists) {
		if (!exists) {
			res.writeHead(404, {
				"Content-Type": "text/plain"
			});
			res.write("404 Not Found\n");
			res.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()) {
			filename += 'index.html';
		}

		fs.readFile(filename, 'binary', function (err, file) {
			if (err) {
				res.writeHead(500, {
					"Content-Type": "text/plain"
				});
				res.write(err + "\n");
				res.end();
				return;
			}

			res.writeHead(200);
			res.write(file, "binary");
			res.end();
		});
	});
}).listen(port);

io.configure(function () {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
});
socket = new io.Socket();

socket.on('connection', function (socket) {
	'use strict';

	socket.on('msg', function (data) {
		io.sockets.emit('new', data);
	});
});

console.log("Static file server running at \n => http://localhost:" + port + "\nCTRL + C to shutdown");
