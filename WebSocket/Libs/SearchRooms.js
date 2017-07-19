
var path = require('path');
var db_operation = require(path.join(__dirname, '/../../Database'));
var online=require('./online.js');
var search_engine=require(path.join(__dirname, '/../../Search_Engine'));

exports.Run=function(data,callback){
    var SearchType=data.type;
    switch(SearchType){
        case 'ALL':{
            db_operation.findData_option('rooms',{},{"sort":["datetime","desc"]},function(err,result){
                if(!err){
                    callback(null,result);
                }else{
                    callback(err,null);
                }
            });
        }break;

        case 'TAG':{
            var tagName=data.tagName;
            db_operation.findData_option('rooms',{tags:{$all:[{tag:tagName}]}},{"sort":["datetime","desc"]},function(err,result){
                if(!err){
                    callback(null,result);
                }else{
                    callback(err,null);
                }
            });
        }break;

        case 'KEYWORDS':{
            var keywords=data.KeyWords.split('%20');
            next(0,keywords,[],function(result){
                var tmp_array=[];
                //get a array which contain sub-array for every keyword
                for(var i=0;i<result.length;i++){//loop for result array
                    //get sub-array
                    var sub_array=result[i];
                    for(var j=0;j<sub_array.length;j++){
                        //loop for sub_array
                        var existing=false;
                        for(var t=0;t<tmp_array.length;t++){
                            //loop for tmp_array
                            if(tmp_array[t].id===sub_array[j]){
                                tmp_array[t].marks+=j;
                                existing=true;
                            }
                        }
                        if(!existing){
                            //console.log(sub_array[j]);
                            tmp_array.push({id:sub_array[j],marks:j});
                        }
                    }
                }
                for(var m=1;m<tmp_array.length;m++){
                    for(var n=0;n<m;n++){
                        if(tmp_array[m].marks<tmp_array[n].marks){
                            //swap
                            var tmp=tmp_array[m];
                            tmp_array[m]=tmp_array[n];
                            tmp_array[n]=tmp;
                        }
                    }
                }
                var pure_ids=[];
                for(var p=0;p<tmp_array.length;p++){
                    pure_ids.push(tmp_array[p].id);
                }
                //got ids, return data
                BDNext(0,pure_ids,[],function(result){
                    //console.log(result);
                    callback(null,result);
                });

                function BDNext(index,array,result,callback){
                    if(index<array.length){
                        var current_room_id=array[index];
                        db_operation.findBy_id('rooms',current_room_id,function(err,findresult){
                            result.push(findresult);
                            index+=1;
                            BDNext(index,array,result,callback);
                        });
                    }else{
                        callback(result);
                    }
                }
            });

            function next(index,array,result,callback){
                if(index<array.length){
                    search_engine.Search(array[index],function(search_result){
                        result.push(search_result);
                        index+=1;
                        next(index,array,result,callback);
                    });
                }else{
                    callback(result);
                }
            }
        }break;

        default :callback('type error',null);
    }
}