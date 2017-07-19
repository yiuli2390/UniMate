var UserBox = document.getElementById('UserBox');
var themeInputBox = document.getElementById('themeInput');
var tagsBox=document.getElementById('tags');
var tagInputBox=document.getElementById('tagInputBox');
var postTagButton=document.getElementById('postTagButton');
var submit=document.getElementById('submitBtn');
var cancel=document.getElementById('cancelBtn');

postTagButton.onclick=function(){
    if(tagInputBox.value!==''){
        var newTagName=tagInputBox.value;
        addTag(newTagName);
        clearTagInput();
    }
    tagInputBox.focus();
}

tagInputBox.onkeydown=function(e){
    if(e.keyCode===13|| e.keyCode===9|| e.keyCode===32){
        postTagButton.click();
        e.returnValue=false;
    }
}

submit.onclick=function(){//create new topic
    //submit theme
    if(themeInputBox.value!==''){
        var tagArr=getTagsArray();
        if(tagArr!=null){
            //continue
            var email=parent.userEmail;
            var data={email:email,theme:themeInputBox.value,tags:tagArr};
            parent.SOCKET.emit('CREATEROOM',data);
        }else{
            alert('Please give some tags for your theme');
        }
    }else{
        alert("Please give a name for your theme");
    }
}

cancel.onclick=function(){
    clearAllInput();
}

function getTagsArray(){
    var count=tagsBox.childNodes.length;
    var arr=[];
    for(var i=1;i<count;i++){
        var value=tagsBox.childNodes.item(i).textContent;
        arr.push({tag:value});
    }
    if(arr.length>0){
        return arr;
    }else{
        return null;
    }
}

function addTag(tagName){
    var tagBlock=document.createElement('SPAN');
    var tagLabel=document.createElement('A');
    tagLabel.innerHTML=tagName;
    var tagButton=document.createElement('B');
    tagButton.onclick=function(){
        tagsBox.removeChild(tagBlock);
    }
    tagBlock.appendChild(tagLabel);
    tagBlock.appendChild(tagButton);
    tagsBox.appendChild(tagBlock);
}

function clearThemeInput(){
    themeInputBox.value='';
}

function clearTagInput(){
    tagInputBox.value='';
}

function clearTags(){
    tagsBox.innerHTML='';
}

function clearAllInput(){
    clearThemeInput();
    clearTagInput();
    clearTags();
}
