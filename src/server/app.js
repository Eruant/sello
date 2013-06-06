/*globals require, process, console */

var app = require('http').createServer(staticServer),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	port = process.env.PORT || 5000,
	io = require('socket.io').listen(app);

function staticServer(req, res) {
	'use strict';
	
	console.log('<<< starting static server >>>');

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
}

function socketServer() {
	'use strict';
	
	console.log('<<< starting socket server >>>');
	
	io.configure(function () {
		io.set("transports", ["xhr-polling"]);
		io.set("polling duration", 10);
	});
	
	io.sockets.on('connection', function (socket) {
		console.log('<<< connection made >>>');
	});
}

app.listen(port);
console.log('<<< listening on port:' + port + ' >>>');

socketServer();