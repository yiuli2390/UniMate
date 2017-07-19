/**
 * Created by MYQ1991 on 15/1/21.
 */
var path = require('path');
var db_operation = require(path.join(__dirname, '/../Database'));

exports.Retrieve=function(plaintext,RoomId){
    //split string into words
    var result=plaintext.split(" ");
    for(var i=0;i<result.length;i++){
        addRetrieve(result[i],RoomId);
    }
}

exports.Search=function(keyword,callback){
    keyword=keyword.toUpperCase();
    db_operation.findData('retrieve',{word:keyword},function(err,result){
        if(!err){
            if(result[0]!=null){
                //data existing, start handle data
                var rooms=result[0].rooms;
                var tmp_array=[];
                for(var i=0;i<rooms.length;i++){
                    var existing=false;
                    for(var j=0;j<tmp_array.length;j++){
                        if(tmp_array[j].id===rooms[i]){
                            //times++
                            tmp_array[j].times+=1;
                            existing=true;
                        }
                    }
                    if(!existing){
                        tmp_array.push({id:rooms[i],times:1});
                    }
                }
                //sort room id
                for(var m=1;m<tmp_array.length;m++){
                    for(var n=0;n<m;n++){
                        if(tmp_array[n].times>tmp_array[m].times){
                            var tmp=tmp_array[m];
                            tmp_array[m]=tmp_array[n];
                            tmp_array[n]=tmp;
                        }
                    }
                }
                //export room id array
                var result_array=[];
                for(var r=0;r<tmp_array.length;r++){
                    result_array.push(tmp_array[r].id);
                }
                callback(result_array);//callback function for deliver data back
            }else{
                callback([]);
            }
        }else{
            callback([]);
        }
    });
}

function addRetrieve(Word,RoomId){
    Word=Word.toUpperCase();
    db_operation.findData('retrieve',{word:Word},function(err,result){
        if(result[0]!=null){
            //already in retrieve collection
            var target=result[0];
            target.rooms.push(RoomId);
            db_operation.updateData('retrieve',{word:Word},target,function(err,result){
                if(err){
                    console.log(err);
                }
            });
        }else{
            //collection not exist or this word not existing yet
            db_operation.insertData('retrieve',{word:Word,rooms:[RoomId]},function(err,result){
                if(err){
                    console.log(err);
                }
            });
        }
    });
}
