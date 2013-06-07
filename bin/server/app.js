/*! sello 07/06/2013 */
function getExtension(a){"use strict";var b=a.lastIndexOf(".");return 0>b?"":a.substr(b)}function staticServer(a,b){"use strict";console.log("<<< starting static server >>>");var c="bin/"+url.parse(a.url).pathname,d=path.join(process.cwd(),c);path.exists(d,function(a){return a?(fs.statSync(d).isDirectory()&&(d+="index.html"),fs.readFile(d,"binary",function(a,c){if(a)return b.writeHead(500,{"Content-Type":"text/plain"}),b.write(a+"\n"),b.end(),void 0;var e=getExtension(d);switch(e){case"txt":b.setHeader("Content-Type","text/plain");break;case"html":case"htm":b.setHeader("Content-Type","text/html");break;case"js":b.setHeader("Content-Type","text/javascript");break;case"css":b.setHeader("Content-Type","text/css")}b.writeHead(200),b.write(c,"binary"),b.end()}),void 0):(b.writeHead(404,{"Content-Type":"text/plain"}),b.write("404 Not Found\n"),b.end(),void 0)})}function socketServer(){"use strict";var a={offices:[{name:"brighton",users:[]},{name:"london",users:[]},{name:"new-york",users:[]},{name:"san-francisco",users:[]}]};console.log("<<< starting socket server >>>"),io.configure(function(){io.set("transports",["xhr-polling"]),io.set("polling duration",10)}),io.sockets.on("connection",function(b){console.log("<<< connection made >>>"),console.log("Host "+b.handshake.headers.host),b.emit("msg",{offices:a.offices}),b.on("user",function(b){if(void 0!==b.user){var c,d=a.offices,e=d.length;for(c=0;e>c;c+=1)d[c].name===b.office&&d[c].users.push(b.user);io.sockets.emit("msg",{offices:a.offices})}})})}var app=require("http").createServer(staticServer),url=require("url"),path=require("path"),fs=require("fs"),port=process.env.PORT||5e3,io=require("socket.io").listen(app);app.listen(port),console.log("<<< listening on port:"+port+" >>>"),socketServer();