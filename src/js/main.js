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
		
		var offices = app.db.offices || {},
			len = offices.length,
			i,
			office,
			ctx = app.ctx;
		
		if (len > 0) {
		
			for (i = 0; i < len; i += 1) {
				
				office = offices[i];
				
				ctx.save();
				ctx.translate(office.position.x, office.position.y);
				ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
				ctx.fillRect(0, 0, 380, 280);
				ctx.restore();
			}
		}
	};
	
	app.init('main-canvas', 800, 600);

	socket.on('msg', function (data) {
		window.console.log(data);
		app.db = data;
	});

}(io, window.document));
