/*globals jQuery, io, twig */

(function ($, io, twig) {
	'use strict';

	var socket = io.connect('http://sello.herokuapp.com'),
		template = twig({
			data: $('#user_template').html()
		});

	socket.on('msg', function (data) {
		$('#users').html(template.render(data));
		console.log(data);
	});

	$('#send').on('click', function () {
		
		var $username = $('#username'),
			$office = $('#office');
		
		socket.emit('user', {
			user: $username.val(),
			office: $office.val()
		});
		$username.val('');
	});


}(jQuery, io, twig));
