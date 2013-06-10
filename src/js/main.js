/*globals jQuery, io */

(function ($, io) {
	'use strict';

	var socket = io.connect('http://sello.herokuapp.com');

	socket.on('msg', function (data) {

		var html = '<h2>Offices</h2>',
			offices = data.offices,
			offices_len = data.offices.length,
			users_len,
			i,
			j;
		
		for (i = 0; i < offices_len; i += 1) {
			
			html += '<div>';
			html += '<h3>' + offices[i].name + '</h3>';
			
			users_len = offices[i].users.length;
			
			html += '<ul>';
			for (j = 0; j < users_len; j += 1) {
				html += '<li>' + offices[i].users[j] + '</li>';
			}
			html += '</ul>';
			
			html += '</div>';
			
		}

		$('#users').html(html);
	});

}(jQuery, io));
