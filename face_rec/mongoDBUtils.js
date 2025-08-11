var mongoose = require('mongoose');
var mongoDBSchema = require('./mongoDBSchema');
var Config = require('./config');

var mongoConn = mongoose.createConnection(Config.dbHostName);

module.exports = {
	db: function(dbname) {
		return mongoConn.useDb(dbname);
	},
	model: function(dbname, modelname, schemaname) {
		var db = mongoConn.useDb(dbname);
		return db.model(modelname, mongoDBSchema[schemaname], modelname);
	},
	dbClose: function(){
		mongoose.disconnect();
	}
};
