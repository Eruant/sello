/*globals jQuery, io */

(function ($, io) {
	'use strict';

	var socket = io.connect('http://sello.herokuapp.com');

	socket.on('db', function (db) {
		console.log(db);
	});

	$('#send_test').on('click', function () {
		socket.emit('user', { user: 12345 });
	});


}(jQuery, io));
