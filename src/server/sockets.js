var port = process.env.PORT || 80,
	io = require('socket.io').listen(port);

console.log('<<< started server >>>');

io.set('transports', ['xhr-polling']);
io.set('polling duration', 10);

console.log('<<< set herou logging >>>');

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});
