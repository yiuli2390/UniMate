
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var online=require('./online.js');
exports.Run=function(data,callback){
    try{
        var clientEmail=data.clientEmail;
        var targetEmail=data.targetEmail;
        db_operation.findData('users',{email:clientEmail},function(err,result){
            if(!err){
                var userData=result[0];
                var following=userData.following;
                for(var i=0;i<following.length;i++){
                    if(following[i].email===targetEmail){
                        userData.following.splice(i,1);
                        db_operation.updateData('users',{email:clientEmail},userData,function(err,result){
                            if(!err){
                                callback(null,'success');
                            }else{
                                callback(err,null);
                            }
                        });
                    }
                }
            }else{
                callback(err,null);
            }
        });
    }catch(err){
        callback(err,null);
    }
}
