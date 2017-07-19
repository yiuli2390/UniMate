
function setStyle() {
    var header = document.getElementById('header');
    var header_logo=document.getElementById('header_logo');
    var header_search = document.getElementById('header_search');
    var header_user_info=document.getElementById('header_user_info');
    var side_bar=document.getElementById('side_bar');
    var main=document.getElementById('main');
    var main_tool_bar=document.getElementById('main_tool_bar');
    var main_frame=document.getElementById('main_frame');

    this.init = function () {
        //init adjusting
        Header_Search_Position();
        Side_Bar_Height();
        Main_Size();
        Header_User_Info();
        Header_Min_Width();
    }

    function Header_Search_Position() {
        var parentWidth = header.offsetWidth;
        var meWidth = header_search.offsetWidth;
        var blankWidth = parentWidth - meWidth;
        header_search.style.left = (blankWidth / 2) + 'px';
    }

    function Side_Bar_Height(){
        var pageHeight=window.innerHeight;
        var headerHeight=header.offsetHeight;
        var restWidth=pageHeight-headerHeight;
        side_bar.style.height=restWidth+'px';
    }

    function Main_Size(){
        var pageHeight=window.innerHeight;
        var pageWidth=window.innerWidth;
        var headerHeight=header.offsetHeight;
        var sidebarWidth=side_bar.offsetWidth;
        var width=pageWidth-sidebarWidth-5;
        var height=pageHeight-headerHeight;
        main.style.width=width+'px';
        main.style.height=height+'px';
    }

    function Header_User_Info(){
        var searchWidth=header_search.offsetWidth;
        var searchLeft=header_search.offsetLeft;
        var left=searchLeft+searchWidth+50;
        header_user_info.style.left=left+'px';
    }

    function Header_Min_Width(){
        var infoWidth=header_user_info.offsetWidth;
        var searchWidth=header_search.offsetWidth;
        var logoWidth=header_logo.offsetWidth;
        header.style.minWidth=(infoWidth+searchWidth+logoWidth+50)+'px';
    }
}
