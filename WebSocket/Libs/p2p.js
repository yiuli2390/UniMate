
var io=require('./IO.js').IO;
var online=require('./online.js');

exports.Run=function(data,callback){
    try{
        var title=data.title;
        var senderEmail=data.senderEmail;
        var senderName=data.senderName;
        var targetUserEmail=data.targeEemail;
        var type=data.type;
        var message=data.message;
        online.GetSocketId(targetUserEmail,function(socketid){
            if(socketid!==null){
                var sendingData= {title:title,senderName:senderName,senderEmail:senderEmail,type:type,message:message};
                io.sockets.socket(socketid).emit(sendingData);
                callback(null,'success');
            }else{
                callback('not online',null);
            }
        });
    }catch(err){
        callback(err,null);
    }
}
