
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var online=require('./online.js');
exports.Run=function(data,callback){
    console.log("DATA IS:"+data);
    try{
        var hostEmail=data.email;
        var theme=data.theme;
        var tags=data.tags;
        var datetime=Date.now();
        db_operation.insertData('rooms',{emcee:hostEmail,theme:theme,datetime:datetime,tags:tags,content:[],attenders:[hostEmail]},function(err,result){
            if(!err){
                //read return result data,then add room id to user's details
                console.log(result);
                var room_id=result[0]._id;
                db_operation.findData('users',{email:hostEmail},function(err,userDara){
                    if(!err){
                        userDara=userDara[0];
                        console.log(userDara);
                        if(userDara.host!=undefined){
                            //insert room id
                            userDara.host.push({id:room_id});
                            db_operation.updateData('users',{email:hostEmail},userDara,function(err,result){
                                if(!err){
                                    callback(null,{room_id:room_id});
                                }else{
                                    callback(err,null);
                                }
                            });
                        }else{
                            //insert field then insert room id
                            db_operation.updateData('users',{email:hostEmail},{$set:{host:[{id:room_id}]}},function(err,result){
                                if(!err){
                                    callback(null,{room_id:room_id});
                                }else{
                                    callback(err,null);
                                }
                            });
                        }
                    }else{
                        callback(err,null);
                    }
                });
            }else{
                callback(err,null);
            }
        });
    }catch (err){
        callback(err,null);
    }
}