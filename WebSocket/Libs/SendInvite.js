
var online = require('./online.js');
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var io=require('./IO.js').IO;

exports.Run = function (data, callback) {
    try {
        var room_id = data.room_id;
        var inviterName = data.name;
        var inviteeList=data.invitees;//obj format should be: {email1,email2,email3...}
        var datetime=Date.now();
        var sendList=[];
        var failCount=0;

        SendNext(0,inviteeList.length,inviteeList,function(err,data){
            if(!err){
                if(sendList.length>0){
                    SendInvitationMessage(room_id,inviterName,sendList);
                }
                callback(null,data);
            }else{
                console.log(data.reason);
                callback(err,null);
            }
        });

        function SendInvitationMessage(room_id,senderName,inviteeEmailList){
            var onlineList=online.GetOnlineList();
            for(var i=0;i<inviteeEmailList.length;i++){
                //loop for send invitation
                var currentInviteeEmail=inviteeEmailList[i];
                var data={title:"INVITATION",inviter:senderName,room_id:room_id};
                for(var j=0;j<onlineList.length;j++){
                    if(onlineList[j].email.localeCompare(currentInviteeEmail)===0){
                        io.sockets.emit(currentInviteeEmail,data);
                        console.log('Send to user:'+currentInviteeEmail);
                    }
                }
            }
        }

        function SendNext(index,length,array,callback){
            if(index<length){
                db_operation.findData('users',{email:array[index]},function(err,data){
                    if(!err){

                        var inviteData={room_id:room_id,inviter:inviterName,datetime:datetime};//invitation data structure

                        var profile=data[0];
                        if(profile.invitation===undefined){//this field not exist
                            db_operation.updateData('users',{email:array[index]},{$set:{invitation:[inviteData]}},function(err,data){
                                if(!err){
                                    index++;
                                    SendNext(index,length,array,callback);
                                }else{
                                    callback(err,{result:"FAIL",reason:"Cannot update user info"});
                                }
                            });
                        }else{//already exist this field
                            if(!isExisted(profile.invitation,room_id)){//doesn't exist same invitation
                                profile.invitation.push(inviteData);//push room id into array
                                db_operation.updateData('users',{email:array[index]},profile,function(err,data){
                                    if(!err){
                                        sendList.push(array[index]);
                                        index++;
                                        SendNext(index,length,array,callback);
                                    }else{
                                        callback(err,{result:"FAIL",reason:"Cannot update user's whole info"});
                                    }
                                });
                            }else{
                                //count sent number
                                failCount++;
                                index++;
                                SendNext(index,length,array,callback);
                            }
                        }
                    }else{
                        callback(err,{result:"FAIL",reason:"Find user's info error"});
                    }
                });
            }else{
                if(failCount>0){
                    callback(null,{result:"PART",reason:failCount+" of them already be invited."});
                }else{
                    callback(null,{result:"SUCCESS"});//callback success data
                }
            }
        }

    } catch (err) {
        callback(err, null);
    }
}

function isExisted(obj_array,roomId){
    for(var i=0;i<obj_array.length;i++){
        if(obj_array[i].room_id.localeCompare(roomId)===0){
            return true;
        }
    }
    return false;
}
