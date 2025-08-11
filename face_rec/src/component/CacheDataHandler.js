//Bundle changes
var ForerunnerDB = require('forerunnerdb');
var fdb = new ForerunnerDB();
var db = fdb.db("users-db");
var profileHandler = db.collection("profile");

var CacheHandler = {
	setProfile : function( profile ){
		var _profile = profileHandler.find({});
		if(_profile.length > 0){
			profileHandler.update({
				email: _profile[0].email
			}, {
				$replace: profile
			});
		}else{
			profileHandler.insert( profile );
		}
	},
	getProfileID : function(){
		var _profile = profileHandler.find({});
		return _profile[0].email;
	},
	isLoggedIn: function(){
		var profile = profileHandler.find({});
		console.log("!-----------------------------------------------------------------------");
		console.log(profile);
		console.log("!-----------------------------------------------------------------------");
		if(profileHandler.find({}).length > 0 ){
			return true;
		}else{
			return false;
		}
	},

	put: function( collectionName , collectionData ){
		
	}
}

//Bundle changes
var CacheHandlerExp = {
	'CacheHandler':CacheHandler,
	'fdb' : fdb
};

module.exports = CacheHandlerExp;
