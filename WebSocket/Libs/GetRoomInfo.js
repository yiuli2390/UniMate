
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var online=require('./online.js');

exports.Run=function(data,callback){
    var room_id=data.room_id;
    db_operation.findBy_id('rooms',room_id,function(err,result){
        if(!err){
            callback(null,result);
        }else{
            callback(err,null);
        }
    });
}