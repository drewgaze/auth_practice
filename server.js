var express = require('express');
var jwt = require('jwt-simple');
var _ = require('lodash');
var bcrypt = require('bcrypt');
var User = require('./user');
var secret = require('./secret');

var app = express();

app.use(require('body-parser').json());

var secretKey = secret;

function findUserByUsername(username) {

	return _.find(users, {username: username});
}

function validateUser(user, password, callback) {

	bcrypt.compare(password, user.password, callback);
}

app.post('/session', function(req, res) {

	var username = req.body.username;

	User.findOne({username: username})
	.select('password')
	.exec(function(err, user) {

		if (err) return next(err);
		if (!user) return res.sendStatus(401);

		bcrypt.compare(req.body.password, user.password, function(err, valid) {

			if (err) return next(err);
			if (!valid) return res.sendStatus(401);

			var token = jwt.encode({username: username}, secretKey);
			res.json(token);
		});
	});
});

app.get('/user', function(req, res) {

	var token = req.headers['x-auth'];
	var decoded = jwt.decode(token, secretKey);
	
	User.findOne({username: decoded.username}, function(err, user) {

		if (err) console.log(err);

		res.json(user);
	});
});

app.post('/user', function(req, res, next) {

	var user = new User({username: req.body.username});
	bcrypt.hash(req.body.password, 10, function(err, hash) {

		user.password = hash;

		user.save(function(err, user) {

			if (err) throw next(err);

			res.sendStatus(201);
		});
	});
});

app.listen(3000);