var userEmail=parent.userEmail;

parent.SOCKET.on('GETINVITATIONS',function(data){
    parent.SOCKET.removeListener('GETINVITATIONS');
    if(data!=null){
        //received data, then process it
        for(var i=0;i<data.length;i++){
            var room_id=data[i].room_id;
            var inviterName=data[i].inviterName;
            var datetime=data[i].datetime;
            var theme=data[i].theme;
            var tags=data[i].tags;
            var emceeName=data[i].emcee;
            var emceePortrait=data[i].portrait;
            var isRead=data[i].isRead;
            var formatTime=new Date(datetime);
            var formatTimeStr=formatTime.getFullYear()+'/'+formatTime.getMonth()+'/'+formatTime.getDate()+' '+formatTime.getHours()+':'+formatTime.getMinutes()+':'+formatTime.getSeconds();
            new Invitation(theme,emceePortrait,emceeName,inviterName,formatTimeStr,isRead,room_id);
        }
    }else{
        //no data received
    }
});

parent.SOCKET.emit('GETINVITATIONS',{email:userEmail});

parent.SOCKET.on('JOINROOM', function (data) {
    parent.SOCKET.removeListener('JOINROOM');
    if (data.result) {
        var theme = data.theme;
        var emcee = data.emcee;
        var room_id=data.room_id;
        parent.currentRoomId=room_id;
        window.location.href='chatting?'+room_id;
    } else {
        alert('Fail to join this room');
    }
});

var content=document.getElementById('content');

function Invitation(themeName,emceePortrait,emceeName,inviterName,formatTime,isRead,room_id){
    var lock=false;

    var invitationCard=document.createElement('DIV');
    invitationCard.setAttribute('CLASS','invitation');
    invitationCard.onclick=function(){
        if(!lock){
            var sendData = {email: userEmail, room_id: room_id};
            parent.SOCKET.emit('JOINROOM', sendData);
        }
    }

    var readStatusTag=document.createElement('SPAN');
    if(isRead){
        readStatusTag.setAttribute('CLASS','read_status_read');
        readStatusTag.innerHTML='READ';
    }else{
        readStatusTag.setAttribute('CLASS','read_status_unread');
        readStatusTag.innerHTML='UNREAD';
    }

    var theme=document.createElement('DIV');
    theme.setAttribute('CLASS','theme');
    theme.innerHTML=themeName;

    var emceeInfo=document.createElement('DIV');
    emceeInfo.setAttribute('CLASS','emceeInfo');
    var portrait=document.createElement('IMG');
    portrait.setAttribute('SRC',emceePortrait);
    var emceename=document.createElement('A');
    emceename.innerHTML=emceeName;
    var emceeTxt=document.createElement('B');
    emceeTxt.innerHTML='created this theme';
    emceeInfo.appendChild(portrait);
    emceeInfo.appendChild(emceename);
    emceeInfo.appendChild(emceeTxt);

    var invitationInfo=document.createElement('DIV');
    invitationInfo.setAttribute('CLASS','invitationInfo');
    var invitername=document.createElement('A');
    invitername.innerHTML=inviterName;
    var invitationDescription=document.createElement('B');
    invitationDescription.innerHTML='sent this invitation to you at '+formatTime;
    invitationInfo.appendChild(invitername);
    invitationInfo.appendChild(invitationDescription);

    var deleteButton=document.createElement('B');
    deleteButton.setAttribute('TITLE','Delete this invitation');
    deleteButton.setAttribute('CLASS','del');
    deleteButton.onmouseover=function(){
        lock=true;
        deleteButton.onmouseout=function(){
            lock=false;
        }
    }
    deleteButton.onclick=function(){
        var sendData={email:userEmail,room_id:room_id};
        parent.SOCKET.emit('DELETEINVITATION',sendData);

        parent.SOCKET.on('DELETEINVITATION',function(data){
            parent.SOCKET.removeListener('DELETEINVITATION');//remove listener
            if(data!=null){
                if(data.result){
                    //success
                    content.removeChild(invitationCard);
                }else{
                    //fail
                    alert('Fail to delete this invitation');
                }
            }else{
                alert('System error');
            }
        });
    }

    //assemble
    invitationCard.appendChild(readStatusTag);
    invitationCard.appendChild(theme);
    invitationCard.appendChild(emceeInfo);
    invitationCard.appendChild(invitationInfo);
    invitationCard.appendChild(deleteButton);

    //add to page

    content.appendChild(invitationCard);

}
