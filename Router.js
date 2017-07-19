
var router=require('express').Router();
var express=require('express');
var path=require('path');
var fs=require('fs');
var public='Public';
exports.init=router;
router.get('/',function(req,res){
    //index page
    fs.readFile(path.join(__dirname,public,'index.html'),'UTF-8',function(err,data){
        res.send(data);
    });
});
router.get('/:name',function(req,res){
    var exposed=require('./expose.json');
    var name=req.params.name;
    var fileName=exposed[name];
    if(fileName!=undefined){
        fs.readFile(path.join(__dirname,public,fileName),'UTF-8',function(err,data){
            if(err) throw err;
            res.status(200).send(data);
        });
    }else{
        console.log("Request has denied");
        res.status(404).send('page not found');
    }
});