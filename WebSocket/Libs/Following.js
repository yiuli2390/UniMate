
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var online=require('./online.js');
exports.Run = function (data, callback) {
    try{
        var userEmail = data.email;
        db_operation.findData('users', {email: userEmail}, function (err, result) {
            var userData = result[0];
            var following = userData.following;
            if (following !== undefined&&following.length!==undefined) {
                //has followings
                if(following.length>0){
                    var array=[];
                    next(0,following.length,following,[],function(err,result){
                        if(!err){
                            callback(null,result);
                        }else{
                            callback(err,null);
                        }
                    });
                }else{
                    callback(null,[]);
                }
            } else {
                callback(err, []);
            }
        });
    }catch (err){
        callback(err,null);
    }
}

function next(i,length,following,array,callback){
    var tmp=following[i];
    var followingEmail=tmp.email;
    //get the person following details
    db_operation.findData('users',{email:followingEmail},function(err,followingData){
        if(err){
            console.log(err);
            callback(err,[]);
        }else{
            var followingObj=followingData[0];
            var followingName=followingObj.name;
            var followingPortrait=followingObj.portrait;
            var status;
            if(online.CheckOnline(followingEmail)){
                status='ONLINE';
            }else{
                status='OFFLINE';
            }
            var obj={name:followingName,email:followingEmail,portrait:followingPortrait,status:status};
            array.push(obj);
            i+=1;
            if(i<length){
                next(i,length,following,array,callback);
            }else{
                callback(null,array);
            }
        }
    });
}
