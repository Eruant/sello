/*globals jQuery, io */

(function ($, io) {
	'use strict';

	var socket = io.connect('http://sello.herokuapp.com');

	socket.on('users', function (data) {

		var html = '<h2>Users</h2>',
			users = data.users,
			len = data.users.length,
			i;

		if (len > 0) {
			html += '<ul>';
		}
		for (i = 0; i < len; i++) {
			html += '<li>' + users[i].user + '(' + users[i].office + ')' + '</li>';
		}
		if (len > 0) {
			html += '</ul>';
		}
		$('#users').html(html);
	});

}(jQuery, io));
