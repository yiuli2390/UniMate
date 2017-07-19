
var path=require('path');
exports.IO=require('socket.io').listen(require('http').createServer().listen(require(path.join(__dirname,'/../../config.json')).WebSocket));
