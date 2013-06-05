/*globals window, jQuery, io */

(function ($, io) {
	'use strict';
	
	window.Chat = {
		socket: null,
		
		init: function (socketURL) {
			this.socket = io.connect(socketURL);
			
			// send message on button click
			$('send_test').on('click', function () {
				window.Chat.sent();
			});
			
			// process any incoming messages
			this.socket.on('new', this.add);
		},
		
		add: function (data) {
		}
	};
}(jQuery, io));