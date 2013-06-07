/*globals jQuery, io */

(function ($, io) {
	'use strict';

	var socket = io.connect('http://sello.herokuapp.com');

	socket.on('users', function (data) {
		console.log(data);
	});

	$('#send_test').on('click', function () {
		socket.emit('user', { user: 12345 });
	});


}(jQuery, io));
