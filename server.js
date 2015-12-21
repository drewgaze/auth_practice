var express = require('express');
var jwt = require('jwt-simple');
var _ = require('lodash');
var bcrypt = require('bcrypt');

var app = express();

app.use(require('body-parser').json());

var users = [{username: 'user', password: '$2a$10$VtTT4D/oMAnYyrHwFyx8hOBkeutbIXM3gC/k4eATBV9rzrQgIschu'}];
var secretKey = 'mySecret';

function findUserByUsername(username) {

	return _.find(users, {username: username});
}

function validateUser(user, password, callback) {

	bcrypt.compare(password, user.password, callback);
}

app.post('/session', function(req, res) {

	var user = findUserByUsername(req.body.username);

	validateUser(user, req.body.password, function(err, valid) {

		if (err || !valid) return res.status(401);

		var token = jwt.encode({username: user.username}, secretKey);

		res.json(token);
	});
});

app.get('/user', function(req, res) {

	var token = req.headers['x-auth'];
	var user = jwt.decode(token, secretKey);
	//TODO: get user from db
	res.json(user);
});

app.listen(3000);