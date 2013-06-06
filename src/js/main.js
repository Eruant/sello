/*globals jQuery, io */

(function ($, io) {
	'use strict';

	var socket = io.connect('http://sello.herokuapp.com');
	socket.on('news', function (data) {
		console.log(data);
		socket.emit('msg', { hello: 'server' });
	});

}(jQuery, io));
