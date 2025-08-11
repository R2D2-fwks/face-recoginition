// communication handler:
//Bundle changes
var PubSub = require('pubsub-js');
var async = require('async');

var CacheHandler = require('./../CacheDataHandler').CacheHandler;

var CredentailsEventBus = function() {
    return this;
};
CredentailsEventBus.prototype.bind = function(channelName, callback) {
    this.token = PubSub.subscribe(channelName, callback);
};
CredentailsEventBus.prototype.unbind = function(channelName, callback) {
    //PubSub.unsubscribe( this.token );
};
CredentailsEventBus.prototype.publish = function(channelName, data) {
    PubSub.publish(channelName, data);
};

// Action Handler
var CredentailsActionHandler = function() {
    return this;
};


var validateCredential = function(gatherCredentialResponse, callback) {
    console.log("! Hey we are going to the server to get validated .. ");
    var payload = {};
    payload.username = gatherCredentialResponse.userName;
    payload.password = gatherCredentialResponse.password;

    $.ajax({
        type: 'POST',
        url: "http://localhost:8084/myapp/authenticate",
        data: payload,
        success: function(data, textStatus) {
            callback(null, data);
            console.log("validation success");
        },
        error: function(data) {
            console.log(data.responseText); // use any display logic here
        },
        dataType: "json"
    });
};

var getProfileFromServer = function(validateCredentialResponse, callback) {
    console.log("getProfile from database for :   " + validateCredentialResponse.tokenID);

    if (validateCredentialResponse.result) {
        var profile = {};
        profile.userid = validateCredentialResponse.userid;
        profile.name = validateCredentialResponse.name;
        profile.email = validateCredentialResponse.tokenID;
        profile.role = validateCredentialResponse.role;

        CacheHandler.setProfile( profile );
        callback(null, profile);
    } else {
        callback(validateCredentialResponse.msg, null);
    }
};

var changeURL = function(profile, callback) {
    	console.log("changeURL")
      window.location.hash = "#Dashboard";

    	// var currentURL = window.location.hash;
      //   window.location.hash = "!";
      //   if (currentURL.split("#").length > 1 & currentURL!='#login') {
      //        window.location.hash = currentURL;
      //   } else {
      //        window.location.hash = "#FaceEnroll";
      //   }
    callback(null, " redirecting to the dashboard page ");
};


CredentailsActionHandler.prototype.validateUserResult = function(msg, data) {

    async.waterfall([
            function gatherCredential(callback) {
                callback(null, data);
            },
            validateCredential,
            getProfileFromServer,
            changeURL
        ], function(err, result) {
            if(err){
                alert(err);
            }
            console.log (result);
    })
};

//Bundle changes
var LoginHelper = {
    'CredentailsEventBus' : CredentailsEventBus,
    'CredentailsActionHandler' : CredentailsActionHandler
};
module.exports = LoginHelper;
