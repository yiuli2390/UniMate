
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var ObjectId=require('mongodb').ObjectID;
var online=require('./online.js');
var io=require('./IO.js').IO;
var retriever=require(path.join(__dirname, '/../../Search_Engine'));

exports.Run=function(data,callback){
    var room_id=data.room_id;
    var type=data.type;
    var message=data.message;
    var senderEmail=data.senderEmail;
    var datetime=Date.now();
    //two parts, write into database first, then broadcast to clients who in current room
    db_operation.findBy_id('rooms',room_id,function(err,result){
        if(!err){
            if(result){
                //next operation, insert data and update
                db_operation.findData('users',{email:senderEmail},function(err,userData){
                    if(!err){
                        if(type==='TXT'){
                            //text data, retrieve it
                            retriever.Retrieve(message,room_id);
                        }
                        var senderName=userData[0].name;
                        var senderPortrait=userData[0].portrait;
                        var appendData= {senderName:senderName,senderPortrait:senderPortrait,type:type,message:message,senderEmail:senderEmail,datetime:datetime};//message data structure
                        result.content.push(appendData);
                        db_operation.updateData('rooms',{_id:ObjectId(room_id)},result,function(err,data){
                            if(!err){
                                //no error, broadcast to clients
                                broadcast(room_id,appendData);
                                callback(null,{result:"success"});//send process result back
                            }else{
                                callback(err,null);
                            }
                        });
                    }else{
                        callback(err,null);
                    }
                });
            }else{
                //no data
                callback(null,{result:"fail"});
            }
        }else{
            callback(err,null);
        }
    });
}

function broadcast(id,data){
    io.sockets.emit(id,data);
}