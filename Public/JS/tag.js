var content=document.getElementById('content');

parent.SOCKET.emit('GETTAGS',{collectionName:'rooms'});
parent.SOCKET.on('GETTAGS',function(data){
    parent.SOCKET.removeListener('GETTAGS');
    if(data!=null){
        for(var i=0;i<data.length;i++){
            addTag(data[i]);
        }
    }
});

function addTag(tagName){
    var tag=document.createElement('DIV');
    tag.setAttribute('class','tag');
    tag.innerHTML=tagName;
    tag.style.backgroundColor=randomColor();
    tag.onclick=function(){
        var data="TAG&"+tagName
        window.location.href='roomsdisplay?'+data;
    }
    content.appendChild(tag);
}

function randomColor(){
    var v1=getRandomColorVal();
    var v2=getRandomColorVal();
    var v3=getRandomColorVal();
    var colorVal="#"+v1+v2+v3;
    return colorVal;
}

function getRandomColorVal(){
    var raw=Math.random();
    if(raw>0.3&&raw<0.8){
        var firstVal=Math.round(raw*255);
        var val=Math.round(firstVal%255);
        var hexString=val.toString(16);
        return hexString;
    }else{
        return getRandomColorVal();
    }
}
