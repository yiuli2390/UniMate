
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var online=require('./online.js');

exports.Run=function(data,callback){
    var collectionName=data.collectionName;
    db_operation.findData_distinct(collectionName,'tags.tag',function(err,result){
        if(!err){
            callback(null,result);
        }else{
            callback(err,null);
        }
    });
}
