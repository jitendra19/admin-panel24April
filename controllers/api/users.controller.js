var config     = require('../../config');
var express = require('express');
var router = express.Router();
var userService = require('../../services/user.service');
var bcrypt = require('bcryptjs');

// routes
router.post('/', registerUser);
router.post('/login', loginUser);
module.exports = router;


function loginUser(req, res){
    console.log("login, I am in server");

    var password = req.body.password;
    userService.login(req.body)
    .then(function(response){
        console.log("response data from user service " + response);
        if(response && bcrypt.compareSync(password, response.password)){
            res.send(response);    
        } else{
            res.sendStatus(401);
        }        
    }, function(err){
        res.sendStatus(500);
    });
};

function registerUser(req, res) {
    console.log('regitering user');
    userService.create(req.body)
        .then(function(response){
            if(response){
                console.log("user data is saved");
                res.sendStatus(200);
            }
            else{
                console.log("data is not saved");
                res.sendStatus(400);

            }
        },function(err){
            res.sendStatus(500);
        });
}


function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
          })
        .catch(function (err) {
            res.status(400).send(err);
        });
}