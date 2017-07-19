
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var ObjectId=require('mongodb').ObjectID;
var online=require('./online.js');

exports.Run=function(data,callback){
    var targetEmail=data.email;
    var id=data.id;
    db_operation.findData('users',{email:targetEmail},function(err,result){
        if(!err){
            if(result.length>0){
                var resultData=result[0];
                delete  resultData.password;//delete password item
                var newData={id:id,data:resultData};
                callback(null,newData);
            }else{
                callback(null,null);
            }
        }else{
            callback(err,null);
        }
    });
}