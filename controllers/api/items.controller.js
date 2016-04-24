var config     = require('../../config');
var express = require('express');
var router = express.Router();
var itemService = require('../../services/item.service');

router.post('/', saveItem);
module.exports = router;

function saveItem(req, res){
    itemService.saveItem(req.body)
    .then(function(response){
        if(response){
            res.send(response);    
        } else{
            res.sendStatus(401);
        }        
    }, function(err){
        res.sendStatus(500);
    });
};