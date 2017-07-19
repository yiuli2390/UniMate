var name=null;
var email=null;
var password=null;
var portraitData=null;
var form_step1=document.getElementById('step_one');
var form_step2=document.getElementById('step_two');
var canvas=document.getElementById('canvas');
canvas.width=300;
canvas.height=300;
var content=canvas.getContext('2d');
var fileBtn=document.getElementById('file');
var selectBtn=document.getElementById('selectImage');
var img=new Image();
var selected=false;
var isClickSubit=false;
var submitBtn=document.getElementById('submit');

submitBtn.onclick=function(){
    isClickSubit=true;
}

selectBtn.onclick=function(){
    fileBtn.click();
    isClickSubit=false;
}

fileBtn.onchange=function(){
    var reader=new FileReader();
    reader.readAsDataURL(this.files[0]);
    reader.onload=function(e){
        img.src=this.result;
        content.drawImage(img,0,0);
        selected=true;
    }
}

function stepOne(){
    name=document.getElementById('name').value;
    email=document.getElementById('email').value;
    var pwd=document.getElementById('password').value;
    var pwd_confirm=document.getElementById('password_confirm').value;
    if(pwd===pwd_confirm){
        password=document.getElementById('password').value;
        form_step1.style.display='none';
        form_step2.style.display='block';
    }else{
        alert('Password not same!');
    }
}

function stepTwo(){
    if(selected){
        portraitData=canvas.toDataURL('image/jpeg');
        var data={"name":name,"email":email,"password":password,"portrait":portraitData};
        parent.SOCKET.emit('REG',data);
    }else{
        if(isClickSubit){
            alert('Please upload a portrait!');
        }
    }
}

parent.SOCKET.on('REG',function(data){
    if(data.result==='success'){
        //success
        parent.userName=data.name;
        parent.userEmail=data.email;
        parent.userPortraitData=data.portrait;
        parent.showUserInfo();
        parent.RegPersonalSocket();
        parent.switchSideBar();
        parent.SOCKET.emit('GETUSERINFO',{email:data.email});
        parent.layer.Dispose();
    }else if(data===undefined){
        //error occurred
        alert('Register Fail: Server error')
    }else{
        //fail
        alert('Register Fail:'+data.reason)
    }
});
