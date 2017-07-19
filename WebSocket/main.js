var path = require('path');
var fs = require('fs');
var online = require('./Libs/online.js');

function WebSocket() {

    var FUNC_LIST_TMP = null;
    var io=require('./Libs/IO.js').IO;

    io.on('connection', function (socket) {
        try {//if json format error or error occurred, use old list for avoid crash whole server.
            var FUNC_LIST = JSON.parse(fs.readFileSync(path.join(__dirname, 'Libs', 'index.json'), 'UTF-8')).index;
            FUNC_LIST_TMP = FUNC_LIST;
        } catch (err) {
            console.log(err);
            FUNC_LIST = FUNC_LIST_TMP;
        }
        socket.on('disconnect', function () {//when user disconnect
            //remove user
            online.RemoveUser_bySocketId(socket.id);
        });
        socket.on('error', function () {//when user disconnect
            //remove user
            online.RemoveUser_bySocketId(socket.id);
        });
        for (var i = 0; i < FUNC_LIST.length; i++) {
            var obj = FUNC_LIST[i];
            var name = obj.name;
            var pathname = obj.pathname;
            eval("socket.on('" + name + "',function(data){" +
            "invokeFunc(data,'" + name + "','" + pathname + "');" +
            "})");
        }

        function invokeFunc(data, func_name, func_pathname) {
            //console.log(data);
            var func = require(path.join(__dirname, 'Libs', func_pathname));
            var id = socket.id;
            func.Run(data, function (err, result) {
                if (err !== null) {
                    console.log(err);
                    socket.emit(func_name, undefined);
                } else {
                    //console.log(result);
                    socket.emit(func_name, result);
                }
            }, id);
        }
    });
}

module.exports.Run = WebSocket;