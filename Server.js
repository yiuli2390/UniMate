var express=require('express');
var io=require('socket.io');
var config=require('./config.json');
var path=require('path');
var websocket=require('./WebSocket');
var router=require('./Router.js');

var server=express();
//listen port for http
server.listen(config.http);
server.use('/IMG',express.static(path.join(__dirname,'Public','IMG')));//direct user to img dir
server.use('/CSS',express.static(path.join(__dirname,'Public','CSS')));//direct user to css dir
server.use('/JS',express.static(path.join(__dirname,'Public','JS')));//direct user to js dir
server.use('/FONT',express.static(path.join(__dirname,'Public','FONT')));//direct user to js dir
server.use('/',router.init);
console.log("Server is running on port:"+config.http);
//run websocket server
websocket.Run();