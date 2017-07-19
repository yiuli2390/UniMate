
function NewLayer(URI,Type_ID){

    var basic=document.createElement('div');
    var layer=document.createElement('div');

    function setBasic(){
        basic.style.opacity='0.4';
        basic.style.backgroundColor='#000000';
        basic.style.position='fixed';
        basic.style.top='0';
        basic.style.left='0';
        basic.style.width=window.innerWidth+'px';
        basic.style.height=window.innerHeight+'px';
        document.body.appendChild(basic);
    }

    function setLayer(width,height){
        layer.style.backgroundColor='#FFFEF9';
        layer.style.borderRadius='5px';
        layer.style.padding='5px';
        layer.style.width=(width-5)+'px';
        layer.style.height=(height-5)+'px';
        layer.style.position='fixed';
        var innerWidth=window.innerWidth;
        var innerHeight=window.innerHeight;
        var layerLeft=(innerWidth-width)/2;
        var layerTop=(innerHeight-height)/2;
        layer.style.left=layerLeft+'px';
        layer.style.top=layerTop+'px';
        setClosebutton();
        setContentComponent();
        document.body.appendChild(layer);
    }

    function setContentComponent(){
        var content=document.createElement('IFRAME');
        content.setAttribute('SRC',URI);
        content.style.height='inherit';
        content.style.width='inherit';
        content.style.border='none';
        layer.appendChild(content);
    }

    function setClosebutton(){
        var close=new Image();
        close.src='/IMG/cross_red.png';
        close.style.display='block';
        close.style.position='absolute';
        close.style.backgroundColor='#FFFFFF';
        close.style.cursor='pointer';
        close.style.borderRadius='100px';
        close.style.top='-16px';
        close.style.right='-16px';
        close.onmouseover=function(){
            close.src='/IMG/cross_green.png';
        }
        close.onmouseout=function(){
            close.src='/IMG/cross_red.png';
        }
        close.onclick=function(){
            Dispose();
        }
        layer.appendChild(close);
    }

    function setLayerType(TYPE_ID){
        switch(TYPE_ID){
            case 1:{
                setLayer(400,300);
            }break;
            case 2:{
                setLayer(400,500);
            }break;
            case 3:{
                setLayer(350,600);
            }break;
            default :{
                setLayer(500,600);
            }
        }
    }
    this.Start=function(){
        setBasic();
        setLayerType(Type_ID);
    }

    this.Dispose=function(){
        Dispose();
    }
    function Dispose(){
        document.body.removeChild(basic);
        document.body.removeChild(layer);
    }
}
