var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config 	   = require('./config');
var mongoose   = require('mongoose');
var path 	   = require('path');

mongoose.createConnection(config.database);

//app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/app'));

// routes
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/items', require('./controllers/api/items.controller'));

/*app.get('/', function(req, res) {
	console.log('dir name: ' + __dirname);
	res.sendFile(path.join(__dirname + '/app/index.html'));
});*/

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});