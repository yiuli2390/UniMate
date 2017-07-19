document.getElementById("big_search_box").onkeyup=function(e){
    if(e.keyCode!=13){
        var txt=document.getElementById("big_search_box").value;
        parent.document.getElementById("header_search_box").value=txt;
    }else{
        parent.search();
    }
}

document.getElementById("big_search_button").onclick=function(){
    parent.search();
}
