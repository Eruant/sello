/*globals jQuery, io */

(function ($, io) {
	'use strict';

	var socket = io.connect('http://sello.herokuapp.com'),
		template = twig({
			data: $('#user_template').html()
		});

	socket.on('msg', function (data) {
		$('#users').html(template.render(data));
	});

}(jQuery, io));
