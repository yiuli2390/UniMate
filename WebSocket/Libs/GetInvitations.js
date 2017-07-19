
var online = require('./online.js');
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));

exports.Run=function(data,callback){
    try{
        var email=data.email;
        db_operation.findData('users',{email:email},function(err,result){
            var userData=result[0];
            if(userData.invitation!=undefined){
                var invitationList=userData.invitation;
                nextInvitation(0,invitationList.length,invitationList,[],function(err,array){
                    if(!err){
                        callback(null,array.reverse());
                    }else{
                        callback(err,null);
                    }
                });
            }else{
                callback(null,null);
            }


            function nextInvitation(index,length,list,array,callback){
                if(index<length){
                    db_operation.findBy_id('rooms',list[index].room_id,function(err,data){
                        if(!err){
                            var theme=data.theme;
                            var tags=data.tags;
                            var emcee=data.emcee;
                            db_operation.findData('users',{email:emcee},function(err,emceeInfo){
                                if(!err){
                                    var emceeData=emceeInfo[0];
                                    var emceeName=emceeData.name;
                                    var emceePortrait=emceeData.portrait;
                                    db_operation.findData('users',{email:email},function(err,info){
                                        if(!err){
                                            var userInfo=info[0];
                                            var portrait=userInfo.portrait;
                                            var data={};
                                            if(userInfo.attend===undefined){
                                                data={room_id:list[index].room_id,inviterName:list[index].inviter,datetime:list[index].datetime,theme:theme,tags:tags,emcee:emceeName,portrait:emceePortrait,isRead:false};
                                            }else{
                                                if(isExisted(userInfo.attend,userInfo.attend.length,list[index].room_id)){//already read
                                                    data={room_id:list[index].room_id,inviterName:list[index].inviter,datetime:list[index].datetime,theme:theme,tags:tags,emcee:emceeName,portrait:emceePortrait,isRead:true};
                                                }else{//unread
                                                    data={room_id:list[index].room_id,inviterName:list[index].inviter,datetime:list[index].datetime,theme:theme,tags:tags,emcee:emceeName,portrait:emceePortrait,isRead:false};
                                                }
                                            }
                                            array.push(data);
                                            index++;
                                            nextInvitation(index,length,list,array,callback);
                                        }else{
                                            callback(err,null);
                                        }
                                    });
                                }else{
                                    callback(err,null);
                                }
                            });
                        }else{
                            callback(err,null);
                        }
                    });
                }else{
                    callback(null,array);
                }
            }
        });
    }catch(err){
        callback(err,null);
    }
}

function isExisted(obj_array,length,id){
    for(var i=0;i<length;i++){
        var tmp_id=obj_array[i].room_id;
        if(tmp_id.equals(id)){
            return true;
        }
    }
    return false;
}
