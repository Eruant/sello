/*globals require, process, console */
/**
 * Sello Server
 * @author Matt Gale
 **/

var port = process.env.PORT || 5000,
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	app = require('http').createServer(function (req, res) {
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

				res.writeHead(200);
				res.write(file, "binary");
				res.end();
			});
		});
	}),
	io = require('socket.io').listen(app);

function socketServer() {
	'use strict';

	var db = {
		offices: [
			{ name: "brighton", label: "Brighton", users: [], position: { x: 0, y: 0 } },
			{ name: "london", label: "London", users: [], position: { x: 400, y: 0 } },
			{ name: "new-york", label: "New York", users: [], position: { x: 0, y: 300 } },
			{ name: "san-francisco", label: "San Francisco", users: [], position: { x: 400, y: 300 } }
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
			
			if (data.user !== undefined) {
				
				var offices = db.offices,
					len = offices.length,
					i,
					idx;
				
				for (i = 0; i < len; i += 1) {
					if (offices[i].name === data.office) {
						
						// get the position of user in array (or -1)
						idx = offices[i].users.indexOf(data.user);
						
						if (idx !== -1) {
							console.log('Removing a user', data.user);
							db.offices[i].users.splice(idx, 1);
						} else {
							console.log('Adding a user', data.user);
							db.offices[i].users.push(data.user);
						}
					}
				}

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
