
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));

exports.Run=function(data,callback){
    var userEmail=data.userEmail;
    var followEmail=data.followEmail;
    db_operation.findData('users',{email:userEmail},function(err,result){
        if(!err){
            var userData=result[0];//get user data
            if(userData.following!=undefined){
                //existing
                var obj={email:followEmail};
                if(isInside(userData.following,followEmail)){
                    //already followed
                    callback(null,{result:false,reason:'already followed'});
                }else{
                    //didn't follow
                    userData.following.push(obj);
                    db_operation.updateData('users',{email:userEmail},userData,function(err,updateResult){
                        if(!err){
                            callback(null,{result:true});
                        }else{
                            callback(err,null);
                        }
                    });
                }
            }else{
                //not existing
                db_operation.updateData('users',{email:userEmail},{$set:{following:[{email:followEmail}]}},function(err,result){
                    if(!err){
                        callback(null,{result:true});
                    }else{
                        callback(err,null);
                    }
                });
            }
        }else{
            callback(err,null);
        }
    });
}

function isInside(array,email){
    for(var i=0;i<array.length;i++){
        if(array[i].email===email){
            return true;
        }
    }
    return false;
}
