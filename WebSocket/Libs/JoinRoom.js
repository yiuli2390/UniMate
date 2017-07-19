
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var ObjectId=require('mongodb').ObjectID;
var online=require('./online.js');
var io=require('./IO.js').IO;

exports.Run=function(data,callback){
    var room_id=data.room_id;
    var attenderEmail=data.email;
    db_operation.findBy_id('rooms',room_id,function(err,result){
        if(!err){
            var id=result._id;
            var theme=result.theme;
            var emcee=result.emcee;
            var array=result.attenders;
            for(var i=0;i<array.length;i++){
                if(array[i].localeCompare(attenderEmail)===0){
                    db_operation.findData('users',{email:attenderEmail},function(err,result){
                        if(!err){
                            var userData=result[0];
                            if(userData.attend!==undefined){
                                //field existing
                                var obj_arr=userData.attend;
                                for(var i=0;i<obj_arr.length;i++){
                                    var tmp_id=obj_arr[i].room_id;
                                    if(tmp_id.toString().localeCompare(id)===0){
                                        callback(null,{result:"success",theme:theme,emcee:emcee,room_id:room_id});
                                        return;
                                    }else{
                                        //console.log('match fail:'+id);
                                    }
                                }
                                userData.attend.push({room_id:id});
                                db_operation.updateData('users',{email:attenderEmail},userData,function(err,resultData){
                                    if(!err){
                                        callback(null,{result:"success",theme:theme,emcee:emcee,room_id:room_id});
                                    }else{
                                        callback(err,null);
                                    }
                                });
                            }else{
                                //not exist this field
                                db_operation.updateData('users',{email:attenderEmail},{$set:{attend:[{room_id:id}]}},function(err,resultData){
                                    if(!err){
                                        callback(null,{result:"success",theme:theme,emcee:emcee,room_id:room_id});
                                    }else{
                                        callback(err,null);
                                    }
                                });
                            }
                        }else{
                            callback(err,null);
                        }
                    });
                    return;
                }
            }
            result.attenders.push(attenderEmail);
            db_operation.updateData('rooms',{_id:ObjectId(room_id)},result,function(err,resultData){
                db_operation.findData('users',{email:attenderEmail},function(err,result){
                    if(!err){
                        var userData=result[0];
                        if(userData.attend!==undefined){
                            //field existing
                            var obj_arr=userData.attend;
                            for(var i=0;i<obj_arr.length;i++){
                                var tmp_id=obj_arr[i].room_id;
                                if(tmp_id.toString().localeCompare(id)===0){
                                    callback(null,{result:"success",theme:theme,emcee:emcee,room_id:room_id});
                                    return;
                                }else{
                                    //console.log('match fail:'+id);
                                }
                            }
                            userData.attend.push({room_id:id});
                            db_operation.updateData('users',{email:attenderEmail},userData,function(err,resultData){
                                if(!err){
                                    callback(null,{result:"success",theme:theme,emcee:emcee,room_id:room_id});
                                }else{
                                    callback(err,null);
                                }
                            });
                        }else{
                            //not exist this field
                            db_operation.updateData('users',{email:attenderEmail},{$set:{attend:[{room_id:id}]}},function(err,resultData){
                                if(!err){
                                    callback(null,{result:"success",theme:theme,emcee:emcee,room_id:room_id});
                                }else{
                                    callback(err,null);
                                }
                            });
                        }
                    }else{
                        callback(err,null);
                    }
                });
            });
        }else{
            callback(err,null);
        }
    });
}
