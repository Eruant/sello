/*jslint nomen:true */
/*globals require, process, __dirname */

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	port = process.env.PORT || 8888;

server.listen(port);

app.use("/", express.static(__dirname + '/bin'));
