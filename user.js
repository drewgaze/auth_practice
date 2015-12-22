var db = require('./db');

var user = db.Schema({

	username: String,
	password: {type: String, select: false}
});

module.exports = db.model('User', user);