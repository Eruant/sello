/*globals window, io */

window.raf = (function () {
	'use strict';
	return window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.mozRequestAnimationFrame
		|| window.oRequestAnimationFrame
		|| window.msRequestAnimationFrame
		|| function (callback, element) {
			window.setTimeout(callback, 1000 / 60);
		};
}());

(function (io, doc) {
	'use strict';

	var socket = io.connect('http://sello.herokuapp.com'),
		app = {};
			
	app.db = {
		offices: [
			{ name: "brighton", label: "Brighton", users: [], position: { x: 0, y: 0 } },
			{ name: "london", label: "London", users: [], position: { x: 410, y: 0 } },
			{ name: "new-york", label: "New York", users: [], position: { x: 0, y: 310 } },
			{ name: "san-francisco", label: "San Francisco", users: [], position: { x: 410, y: 310 } }
		]
	};
	
	app.deg = Math.PI / 180;
			
	app.init = function (id, width, height) {
				
		// init from functions
		this.width = width;
		this.height = height;
		this.canvas = doc.getElementById(id);
		
		// set canvas width
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		
		// get the context
		this.ctx = this.canvas.getContext('2d');
		
		// set up the timestamps
		this.starttime = window.mozAnimationStartTime || Date.now();
		this.laststep = this.startTime;
		
		// start the animation
		window.raf(this.step);
	};
			
	app.step = function (timestamp) {
		
		// set the update times
		var progress = timestamp - app.starttime,
			steptime = timestamp - app.laststep;
		
		// reset the last step
		app.laststep = timestamp;
		
		// clear the canvas
		app.canvas.width = app.width;
		
		// update and draw to the canvas
		app.update(steptime, progress);
		app.draw();
		
		// do the next step
		window.raf(app.step);
	};
		
	app.update = function (steptime, progress) {
	};
			
	app.draw = function () {
		
		var ctx = app.ctx,
			offices = app.db.offices || {},
			office_len = offices.length,
			users_len,
			i,
			j,
			office,
			user;
		
		if (office_len > 0) {
		
			for (i = 0; i < office_len; i += 1) {
				
				office = offices[i];
				
				ctx.save();
				ctx.translate(office.position.x, office.position.y); // move to office position
				
				// draw background
				ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
				ctx.fillRect(0, 0, 390, 290);
				
				// add label
				ctx.font = "normal 14px Arial";
				ctx.fillStyle = '#fff';
				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				ctx.fillText(office.label, 10, 10);
				
				// draw characters
				users_len = office.users.length;
				
				ctx.save();
				ctx.translate(20, 230); // move to bottom to start drawing characters
				
				for (j = 0; j < users_len; j += 1) {
					user = office.users[j];
					
					// draw this users
					ctx.fillStyle = '#fff';
					ctx.fillRect(0, 0, 20, 40);
					
					// add the label
					ctx.save();
					ctx.translate(10, -15);
					ctx.rotate(-45 * app.deg);
					ctx.fillText(user, 0, 0);
					ctx.restore();
					
					// move the brush for the next users
					ctx.translate(40, 0);
					
				}
				ctx.restore(); // move brush back to office origin
				
				ctx.restore(); // move brush back to origin
			}
		}
	};
	
	app.init('main-canvas', 800, 600);

	socket.on('msg', function (data) {
		app.db = data;
	});

}(io, window.document));
