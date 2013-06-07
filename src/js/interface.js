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
		for (i = 0; i < len; i += 1) {
			html += '<li>' + users[i] + '</li>';
		}
		if (len > 0) {
			html += '</ul>';
		}
		$('#users').html(html);
	});

	$('#send').on('click', function () {
		
		var $username = $('#username'),
			$office = $('#office');
		
		socket.emit('user', {
			user: $username.val(),
			office: $office.val();
		});
		$username.val('');
	});


}(jQuery, io));
