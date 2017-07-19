var params = window.location.search.substr(1);
var params_arr = params.split('&');
var useremail = params_arr[0];
var room_id = params_arr[1];
var tags = [];

for (var i = 2; i < params_arr.length; i++) {
    tags.push(params_arr[i]);
}

var selectedList=[];//selected users list

var submitButton=document.getElementById('submitBtn');

var selectCount=document.getElementById('selectCount');

var followingContainer = document.getElementById('following');

var allUsersContainer=document.getElementById('all');

//tabs elements
var FollowingTab=document.getElementById('FollowingTab');
var AllTab=document.getElementById('AllTab');

FollowingTab.onclick=function(){
    switchTabs('FOLLOWING');
}

AllTab.onclick=function(){
    switchTabs('ALL');
}

function switchTabs(tabName){
    switch(tabName){
        case 'FOLLOWING':{
            followingContainer.style.display='block';
            allUsersContainer.style.display='none';
            FollowingTab.setAttribute('CLASS','selected');
            AllTab.setAttribute('CLASS','unselected');
        }break;

        case 'ALL':{
            followingContainer.style.display='none';
            allUsersContainer.style.display='block';
            FollowingTab.setAttribute('CLASS','unselected');
            AllTab.setAttribute('CLASS','selected');
        }break;

        default :{
            followingContainer.style.display='block';
            allUsersContainer.style.display='none';
            FollowingTab.setAttribute('CLASS','selected');
            AllTab.setAttribute('CLASS','unselected');
        }

    }
}

function Profile(container, email, name, portrait) {
    var profile = document.createElement('DIV');
    profile.setAttribute('CLASS', 'profile');
    profile.setAttribute('NAME', email);
    var portrait_img = document.createElement('IMG');
    portrait_img.setAttribute('SRC', portrait);
    var username = document.createElement('A');
    username.innerHTML = name;
    var selectStatus = document.createElement('B');
    selectStatus.setAttribute('CLASS','unselected');
    profile.onclick=function(){
        switch (selectStatus.getAttribute('CLASS')){
            case 'selected':{
                if(RemoveSelect(email)){
                    selectStatus.setAttribute('CLASS','unselected');
                    profile.style.backgroundColor='#FCFCFC';
                    username.style.color='#000000';
                }
            }break;
            case 'unselected':{
                if(AddSelect(email)){
                    selectStatus.setAttribute('CLASS','selected');
                    profile.style.backgroundColor='#381F00';
                    username.style.color='#FFFFFF';
                }
            }break;
        }
    };
    profile.appendChild(portrait_img);
    profile.appendChild(username);
    profile.appendChild(selectStatus);
    container.appendChild(profile);
}

function UpdateSelectCount(){
    selectCount.innerHTML=selectedList.length;
}

function AddSelect(email){
    if(selectedList.length<10){
        selectedList.push(email);
        UpdateSelectCount();
        return true;
    }else{
        return false;
    }
}

function RemoveSelect(email){
    var index=selectedList.indexOf(email);
    if(index>-1){
        selectedList.splice(index,1);
        UpdateSelectCount();
        return true;
    }else{
        return false;
    }
}

parent.SOCKET.on('FOLLOWING', function (data) {//get following users data
    parent.SOCKET.removeListener('FOLLOWING');
    //use these data
    for (var i = 0; i < data.length; i++) {
        var name = data[i].name;
        var email = data[i].email;
        var portrait = data[i].portrait;
        var status=data[i].status;
        if(status!=='OFFLINE'){
            new Profile(followingContainer,email,name,portrait);
        }
    }
});

parent.SOCKET.on('ONLINEUSERS', function (data) {//get all users data
    parent.SOCKET.removeListener('ONLINEUSERS');
    //use these data
    for (var i = 0; i < data.length; i++) {
        var name = data[i].name;
        var email = data[i].email;
        var portrait = data[i].portrait;
        new Profile(allUsersContainer,email,name,portrait);
    }
});

var requestFollowingData = {email: useremail};
parent.SOCKET.emit('FOLLOWING', requestFollowingData);
var requestAllUsersData={email:useremail,tags:[]};
parent.SOCKET.emit('ONLINEUSERS',requestAllUsersData);

submitButton.onclick=function(){
    if(selectedList.length>0){
        var data={room_id:room_id,name:parent.userName,invitees:selectedList};
        parent.SOCKET.emit('SENDINVITE',data);
    }else{
        alert('Please select someone for invite!');
    }
}

parent.SOCKET.on('SENDINVITE',function(data){
    parent.SOCKET.removeListener('SENDINVITE');
    if(data!=null){
        switch (data.result){
            case 'SUCCESS':{
                alert('All invitations are successfully sent');
                parent.layer.Dispose();
            }break;

            case 'PART':{
                alert(data.reason);
                parent.layer.Dispose();
            }break;

            default :{alert(data.result);}
        }
    }else{
        alert('Fail to send invitations');
    }
});
