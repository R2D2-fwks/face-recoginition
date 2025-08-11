var Hapi = require('hapi');
var servicemanager = require('./serviceManager.js');
var server = new Hapi.Server();
//for hapi above version 8 & bundle changes
var inert = require('inert');
// var Hoek = require('hoek');
var fs = require('fs');
var async = require('async');
var Configs = require('./config');

var fileNameObj = {};
var Config = {
    MixInsideFolder: __dirname + '/tempDataFolder/uploads/'
};
/*  starting out the server  on a preconfigured host and port
 */
 //for hapi above version 8 & bundle changes
server.register(inert, function (err) {
	server.connection({
	     host: Configs.serviceHostName,
	     port: Configs.servicePort
	});

	server.ext('onPostHandler', function(request, reply) {
		
	    if (request.raw.req.method == "GET" 
	    		&& request._route.path == '/myapp/files/{param*}') {

	        const response = request.response;
	    	// console.log("response>>>",response.source.path);
	        if (response.isBoom &&
	            response.output.statusCode === 404) {

	            return reply.file('404.html').code(404);
	        } else {
	            response.once('finish', function() {
	                // delete tmp file here
	                // fs.rename(response.source.path.toString().trim(), 
	                // 		response.source.path.toString().trim() + '.locked');

	            });
	            // reply(request.response)
	        }

	    }
	    return reply.continue();
	});

	/*
	    Adding routes information to server..P
	 */

	server.route(servicemanager);
	server.start(
	    function() {
	         console.log(' ** Hapi is listening at port '+Configs.servicePort+' and the host address is http://'+Configs.serviceHostName+':'+Configs.servicePort+'/myapp/ ');
	    }
	);
});