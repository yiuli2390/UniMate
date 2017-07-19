
var onlineList = [];

exports.AddUser = function (email, socketId) {
    var user = {email: email, socket_id: socketId};
    onlineList.push(user);
}

exports.RemoveUser = function (email) {
    for(var i=0;i<onlineList.length;i++){
        if(onlineList[i].email===email){
            onlineList.splice(i,1);
            break;
        }
    }
}

exports.RemoveUser_bySocketId=function(socketId){
    for(var i=0;i<onlineList.length;i++){
        if(onlineList[i].socket_id===socketId){
            onlineList.splice(i,1);
            break;
        }
    }
}

exports.GetSocketId=function(email,callback){
    for(var i=0;i<onlineList.length;i++){
        if(onlineList[i].email===email){
            callback(onlineList[i].socket_id);
            return;
        }
    }
    callback(null);
}

exports.GetEmail=function(socketId,callback){
    for(var i=0;i<onlineList.length;i++){
        if(onlineList[i].socket_id===socketId){
            callback(onlineList[i].email);
            return;
        }
    }
    callback(null);
}

exports.GetOnlineList=function(){
    return onlineList;
}

exports.CheckOnline=function(email){
    for(var i=0;i<onlineList.length;i++){
        if(onlineList[i].email===email){
            return true;
        }
    }
    return false;
}