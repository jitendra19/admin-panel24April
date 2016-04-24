var config = require('../config');
var mongo = require('mongodb');
var mongoose   = require('mongoose');
var Q = require('q');
var bcrypt = require('bcryptjs');

var db = mongoose.connect(config.database); 

/*var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // we're connected!
  consle.log("connection has opened now");
});*/

var ghanta = mongoose.Schema({firstName:String, lastName:String, username:String, password:String});

var Ghanta = mongoose.model('Ghanta', ghanta);

var service = {};

service.create = create;
service.update = update;
service.login = login;
service.delete = _delete;

module.exports = service;

function login(body){
    var deferred = Q.defer();


    Ghanta.findOne({username:body.username}, function(err,response){
        if(err){
            console.log("found some err in login");
            deferred.reject(err);
        }
        else{
            console.log("you are logged in");
            deferred.resolve(response);
        }
    });
    return deferred.promise;
};

function create(userParam) {
    var deferred = Q.defer();
    var sampleUser = new Ghanta();

    sampleUser.firstName = userParam.firstName;  
    sampleUser.lastName = userParam.lastName; 
    sampleUser.username = userParam.username;
    sampleUser.password = bcrypt.hashSync(userParam.password, 10);

    sampleUser.save(function (err, data) {
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

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    usersDb.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            usersDb.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        usersDb.findAndModify(
            { _id: _id },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    usersDb.remove(
        { _id: _id },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}