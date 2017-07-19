
var online = require('./online.js');
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));

exports.Run=function(data,callback){
    var userEmail=data.email;
    var room_id=data.room_id;
    db_operation.findData('users',{email:userEmail},function(err,result){
        if(!err){
            var userData=result[0];
            var found=false;
            for(var i=0;i<userData.invitation.length;i++){
                var tmp_id=userData.invitation[i].room_id;
                if(tmp_id===room_id){
                    found=true;
                    userData.invitation.splice(i,1);
                    db_operation.updateData('users',{email:userEmail},userData,function(err,data){
                        if(!err){
                            callback(null,{result:true});
                        }else{
                            callback(err,null);
                        }
                    });
                }
            }
            if(!found){
                callback(null,{result:false});
            }
        }else{
            //handle error
            callback(err,null);
        }
    });
}
