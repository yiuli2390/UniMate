
var online = require('./online.js');
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
exports.Run = function (data, callback, socketId) {
    try {
        var obj_data = data;
        var email = obj_data.email.toUpperCase();
        var password = obj_data.password;
        db_operation.findData('users', {"email": email, "password": password}, function (err, result) {
            if (err) {
                callback(err, null);
            } else {
                if (result.length > 0) {
                    var newData=null;
                    if(result[0].following!=undefined){
                        newData = {result: "true", name: result[0].name, email: email, portrait: result[0].portrait,following:result[0].following};
                    }else{
                        newData = {result: "true", name: result[0].name, email: email, portrait: result[0].portrait,following:[]};
                    }
                    online.AddUser(email, socketId);
                    callback(null, newData);
                } else {
                    var newData = {result: "fail"};
                    callback(null, newData);
                }
            }
        });
    } catch (err) {
        callback(err, null);
    }
}
