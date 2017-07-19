var socket=parent.SOCKET;

function sendLoginData(){
    var email=document.getElementById('email').value;
    var password=document.getElementById('password').value;
    var data={"email":email,"password":password};
    parent.SOCKET.emit('LOGIN',data);
}
parent.SOCKET.on('LOGIN',function(data){
    if(data.result==='true'){
        //login success
        parent.userName=data.name;
        parent.userEmail=data.email;
        parent.userPortraitData=data.portrait;
        parent.myFollowing=data.following;
        parent.showUserInfo();
        parent.RegPersonalSocket();
        parent.switchSideBar();
        parent.SOCKET.emit('GETUSERINFO',{email:data.email});
        parent.layer.Dispose();
    }else{
        //login fail
        alert('Email or password is incorrect');
    }
})
