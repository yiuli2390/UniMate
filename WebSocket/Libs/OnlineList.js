
var online=require('./online.js');

exports.Run=function(data,callback){
    try{
        var list=online.GetOnlineList();
        callback(null,list);
    }catch(err){
        callback(err,null);
    }
}