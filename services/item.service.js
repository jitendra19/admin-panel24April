var config = require('../config');
var mongo = require('mongodb');
var mongoose   = require('mongoose');
var Q = require('q');

var item = mongoose.Schema({name:String, category:String, quantity:Number, description:String, price:String, photo:String});

var Item = mongoose.model('Item', item);

var service = {};

service.saveItem =  saveItem;

module.exports = service;

function saveItem(itemParam) {
    var deferred = Q.defer();
    var sampleItem = new Item();

    sampleItem.name = itemParam.name;  
    sampleItem.category = itemParam.category; 
    sampleItem.quantity = itemParam.quantity;
    sampleItem.description = itemParam.description;
	sampleItem.price = itemParam.price;  
    sampleItem.photo = itemParam.photo; 

    sampleItem.save(function (err, data) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        }
        else {
            console.log('Saved : ', data );
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}