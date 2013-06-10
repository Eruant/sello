/*globals require, process, console */
/**
 * Sello Server
 * @author Matt Gale
 **/

var app = require('http').createServer(staticServer),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	port = process.env.PORT || 5000,
	io = require('socket.io').listen(app);

function getExtension(filename) {
	'use strict';
	
	var i = filename.lastIndexOf('.');
	return (i < 0) ? '' : filename.substr(i);
}

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
				res.writeHead(500, { "Content-Type": "text/plain"});
				res.write(err + "\n");
				res.end();
				return;
			}

			var ext = getExtension(filename);
			switch (ext) {
			case 'txt':
				res.setHeader("Content-Type", "text/plain");
				break;
			case 'html':
			case 'htm':
				res.setHeader("Content-Type", "text/html");
				break;
			case 'js':
				res.setHeader("Content-Type", "text/javascript");
				break;
			case 'css':
				res.setHeader("Content-Type", "text/css");
				break;
			}
			res.writeHead(200);
			res.write(file, "binary");
			res.end();
		});
	});
}

function socketServer() {
	'use strict';

	var db = {
		offices: [
			{ name: "Brighton", users: [] },
			{ name: "London", users: [] },
			{ name: "New-York", users: [] },
			{ name: "San-Francisco", users: [] }
		]
	};

	console.log('<<< starting socket server >>>');

	io.configure(function () {
		io.set("transports", ["xhr-polling"]);
		io.set("polling duration", 10);
	});

	io.sockets.on('connection', function (socket) {
		console.log('<<< connection made >>>');
		console.log('Host ' + socket.handshake.headers.host);

		// send the current database
		socket.emit('msg', {
			offices: db.offices
		});

		// wait for new users
		socket.on('user', function (data) {
			
			console.log('"user" emitted', data);
			if (data.user !== undefined) {
				
				var offices = db.offices,
					len = offices.length,
					i,
					idx;
				
				for (i = 0; i < len; i += 1) {
					if (offices[i].name === data.office) {
						
						console.log('Seeing if a user already exists');
						
						idx = offices[i].users.indexOf(data.user);
						
						console.log('idx', idx);
						
						if (idx !== -1) {
							console.log('Removing a user', data.user);
							db.offices[i].users.splice(idx, 1);
						} else {
							console.log('Adding a user', data.user);
							db.offices[i].users.push(data.user);
						}
					}
				}
				
				/*var idx = db.users.indexOf(data.user); 
				if (idx !== -1) {
					db.users.splice(idx, 1);
				} else {*/
					//db.offices[data.office].push(data.user);
				//}

				// alert all clients that there is a new user
				io.sockets.emit('msg', {
					offices: db.offices
				});
			}
		});
	});
}

app.listen(port);
console.log('<<< listening on port:' + port + ' >>>');

socketServer();
