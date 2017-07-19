/**
 * Created by MYQ1991 on 15/1/21.
 */
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var objectid = require('mongodb').ObjectID;
var config = require('./config.json');
var url = 'mongodb://' + config.HOST + ':' + config.PORT + '/' + config.DATABASE;

exports.findBy_id = function (collection_name, id, callback) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(collection_name);
        collection.findOne({_id: objectid(id)}, function (err, result) {
            callback(err, result);
            db.close();
        });
    });
}

exports.findData = function (collection_name, condition, callback) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(collection_name);
        collection.find(condition).toArray(function (err, result) {
            callback(err, result);
            db.close();
        });
    });
}

exports.findData_distinct=function(collection_name,distinctCondition,callback){
    MongoClient.connect(url,function(err,db){
        var collection=db.collection(collection_name);
        collection.distinct(distinctCondition,function(err,result){
            callback(err,result);
            db.close();
        });
    });
}

exports.findData_option = function (collection_name, condition,optionCondition, callback) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(collection_name);
        collection.find(condition,optionCondition).toArray(function (err, result) {
            callback(err, result);
            db.close();
        });
    });
}

exports.deleteData = function (collection_name, condition, callback) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(collection_name);
        collection.findAndRemove(condition, function (err, result) {
            callback(err, result);
            db.close();
        });
    });
}

exports.updateData = function (collection_name, limit, data, callback) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(collection_name);
        collection.update(limit, data, function (err, result) {
            callback(err, result);
            db.close();
        });
    });
}

exports.insertData = function (collection_name, data, callback) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(collection_name);
        collection.insert(data, function (err, result) {
            callback(err, result);
            db.close();
        });
    });
}
