
var online = require('./online.js');
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
exports.Run = function (data, callback, socketId) {
    try {
        var obj_data = data;
        var name = obj_data.name;
        var email = obj_data.email.toUpperCase();
        var password = obj_data.password;
        var portrait = obj_data.portrait;
        db_operation.findData('users', {email: email}, function (err, result) {
            if (result.length > 0) {
                //existed, fail
                var result_data = {result: "fail", reason: "This email address has been registered"};
                callback(null, result_data);
            } else {
                //not existed, continue
                db_operation.insertData('users', {
                    name: name,
                    email: email,
                    password: password,
                    portrait: portrait
                }, function (err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        var result_data = {
                            result: "success",
                            name: result[0].name,
                            email: result[0].email,
                            portrait: result[0].portrait
                        };
                        online.AddUser(result[0].email,socketId);
                        callback(null, result_data);
                    }
                });
            }
        })
    } catch (err) {
        callback(err, null);
    }
}
