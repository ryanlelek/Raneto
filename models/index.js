var mongoose = require('mongoose');
var config = require('../server/config');

mongoose.connect(config.mongodb.db,function(error){
	if(error){
		console.log('connect to %s error: ',config.mongodb.db,error.message);
		process.exit(1);
	}
});

require('./user');

exports.User = mongoose.model('User');
