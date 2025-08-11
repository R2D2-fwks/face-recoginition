// var mongoose = require('mongoose');
var async = require('async');
// var mongoDBUtil = require('./mongoDBUtils');
var _ = require('lodash');
var http = require('http');
var path = require("path");
var FormData = require('form-data');
var fs = require('fs');
var AppConfig = require('./config');
var sparqls = require('sparqling-star');

var httprequest = require('request');

// File upload functionality implementation - Starts
var multiparty = require('multiparty');
var fs = require('fs');

var Config = {
    MixInsideFolder: __dirname + path.sep + 'tempDataFolder' + path.sep + 'uploads' + path.sep,
    downloadDirPrefix: '/myapp/files/'
};



var getResultObj = function(status, msg, process, fileName) {
    var result = new Object();
    result['status'] = status;
    result['msg'] = msg;
    result['stackTrace'] = {
        "process": process,
        "fileName": fileName
    };

    return result;
};


// File upload functionality implementation - Ends

var serviceManager = {};

serviceManager.index = {
    cache: {
        expiresIn: 0
    },
    cors: true,
    handler: {
        file: {
            path: process.cwd() + '/dist/index.html'
        }
    }
};

serviceManager.js = {
    cache: {
        expiresIn: 0
    },
    cors: true,
    handler: {
        directory: {
            // we will be passing the javascript and the CSS ..
            path: process.cwd() + '/dist/'
        }
    }
};

// serviceManager.getPersonalityInfo = {
//     cache: {
//         expiresIn: 0
//     },
//     cors: true,
//     handler: function(request, reply) {
//         var personName = request.payload.personName.charAt(0).toUpperCase() + request.payload.personName.slice(1);
//         console.log("getPersonalityInfo" + personName);
//         var myquery = "SELECT ?BirthName ?BirthDate ?Occupation ?Spouse_name ?BirthPlace ?Description WHERE { <http://dbpedia.org/resource/" + personName + "> \
//                 OPTIONAL {dbo:birthDate  ?BirthDate} . \
//                 OPTIONAL {<http://dbpedia.org/resource/" + personName + "> dbo:birthName  ?BirthName} . \
//                 OPTIONAL {<http://dbpedia.org/resource/" + personName + "> dbo:spouse ?spouse . ?spouse rdfs:label ?Spouse_name .filter(langMatches(lang(?Spouse_name), 'en'))} . \
//                 OPTIONAL {<http://dbpedia.org/resource/" + personName + "> dbp:occupation ?Occupation} . \
//                 OPTIONAL {<http://dbpedia.org/resource/" + personName + "> dbp:birthPlace ?BirthPlace} .  \
//                 OPTIONAL {<http://dbpedia.org/resource/" + personName + "> rdfs:comment ?Description .filter(langMatches(lang(?Description),'en'))} \
//         }";
//         var sparqler = new sparqls.Client();
//         sparqler.send(myquery, function(error, data) {
//             // console.log(data.results.bindings[0]);
//             console.log(data);
//             reply({
//                 "msg": "success",
//                 "data": data.results.bindings[0]
//             });
//         });
//     }
// };

serviceManager.getPersonalityInfo = {
    cache: {
        expiresIn: 0
    },
    cors: true,
    handler: function(request, reply) {
        var personName = request.payload.personName.charAt(0).toUpperCase() + request.payload.personName.slice(1);
        var myquery = "SELECT ?BirthName ?BirthDate ?Occupation ?Spouse_name ?BirthPlace ?Description WHERE { <http://dbpedia.org/resource/" + personName + "> \
                dbo:birthDate  ?BirthDate . \
                OPTIONAL {<http://dbpedia.org/resource/" + personName + "> dbo:birthName  ?BirthName }. \
                OPTIONAL {<http://dbpedia.org/resource/" + personName + "> dbo:spouse ?spouse . ?spouse rdfs:label ?Spouse_name .filter(langMatches(lang(?Spouse_name), 'en'))} . \
                OPTIONAL {<http://dbpedia.org/resource/" + personName + "> dbp:occupation ?Occupation }. \
                OPTIONAL {<http://dbpedia.org/resource/" + personName + "> dbp:birthPlace ?BirthPlace } .  \
                OPTIONAL {<http://dbpedia.org/resource/" + personName + "> rdfs:comment ?Description .filter(langMatches(lang(?Description),'en'))} \
        }";
        var sparqler = new sparqls.Client();
        sparqler.send(myquery, function(error, data) {
            console.log(data.results.bindings[0]);
            reply({
                "msg": "success",
                "data": data.results.bindings[0]
            });
        });
    }
};

serviceManager.getPersonalityImage = {
    cache: {
        expiresIn: 0
    },
    cors: true,
    handler: function(request, reply) {
        var personName = request.payload.personName;
        console.log(personName);
        httprequest({
            uri: "http://192.168.12.39:5000/" + personName + ".jpg",
            method: "GET",
        }, function(err, response, body) {
            reply({
                msg: "Success",
                image: body
            }).header('Content-Type', 'image/jpg');
        });
    }
};


serviceManager.uploadImage = {
    payload: {
        maxBytes: 20971520000,
        output: 'stream',
        parse: false
    },
    cache: {
        expiresIn: 0
    },
    cors: true,
    handler: function(request, reply) {
        var form = new multiparty.Form();
        form.parse(request.payload, function(err, fields, files) {
            _.forEach(files, function(file, key) {
                console.log(file[0].path);
                var formData = {
                    file: fs.createReadStream(file[0].path)
                };
                httprequest.post({
                    url: 'http://192.168.12.39:5000/upload',
                    formData: formData
                }, function(err, httpResponse, body) {
                    if (err) {
                        return console.error('upload failed:', err);
                        reply({
                            "msg": "error"
                        });
                    }
                    console.log('Upload successful!  Server responded with:', body);
                    reply(body);
                });
            });
        });
    }
};

serviceManager.enrollImage = {
  payload: {
      maxBytes: 20971520000,
      output: 'stream',
      parse: false
  },
  cache: {
      expiresIn: 0
  },
  cors: true,
  handler: function(request, reply) {
      var form = new multiparty.Form();
      form.parse(request.payload, function(err, fields, files) {
        console.log("enroll");
        console.log(fields.name[0]);
          _.forEach(files, function(file, key) {
              console.log(file[0].path);
              var formData = {
                  file: fs.createReadStream(file[0].path),
                  name: fields.name[0]
              };
              httprequest.post({
                  url: 'http://192.168.12.39:5000/enroll',
                  formData: formData
              }, function(err, httpResponse, body) {
                  if (err) {
                      return console.error('upload failed:', err);
                      reply({
                          "msg": "error"
                      });
                  }
                  console.log('Upload successful!  Server responded with:', body);
                  reply(body);
              });
          });
      });
  }
};

// User Authentication - Login Component
serviceManager.authenticate = {
    cache: {
        expiresIn: 0
    },
    cors: true,
    handler: function(request, reply) {
        // console.log("***USER **** " + request.payload.username);
        // console.log("***PASSWORD **** " + request.payload.password);
        function responseObj(result, msg, res) {
            var response = {};
            response.result = result;
            response.msg = msg;
            response.userid = res.userId;
            response.name = res.userName;
            response.role = res.userType;
            response.tokenID = res.email;

            // console.log("response>>", response);
            return response;
        }

        var findQuery = {},
            find = [];
        find.push({
            'userid': request.payload.username
        });
        find.push({
            'userpass': request.payload.password
        });
        findQuery['$and'] = find;
        reply(responseObj(true, "Success", {
            "userId": "V",
            "userName": "V",
            "userType": "Admin",
            "email": "Vin@SF.com"
        }));

        // mongoDBUtil.model('users', 'users', 'userSchema').find(findQuery).count(function(err, count) {
        //     if (err) {
        //         reply(responseObj(false, "Error occurred. Please try again later.", {'userid':request.payload.username, 'userName': '', 'usertype': '', 'email': ''}));
        //     } else {
        //         if (count <= 0) {
        //             reply(responseObj(false, "User ID or Password is wrong.", {'userid':request.payload.username, 'userName': '', 'usertype': '', 'email': ''}));
        //         } else {
        //             mongoDBUtil.model('users', 'users', 'userSchema').find(findQuery, {'userid': 1, 'userName': 1, "email": 1, "usertype": 1}, function(err, result) {
        //                 if (err) {
        //                     reply(responseObj(false, "Error occurred. Please try again later.", {'userid':request.payload.username, 'userName': '', 'usertype': '', 'email': ''}));
        //                 }
        //                 reply(responseObj(true, "Success", JSON.parse(JSON.stringify(result[0]))));
        //             });
        //         }
        //     }
        // });
    }
};

// Dashboard Component
serviceManager.getDashBoardCollectionsData = {
    cache: {
        expiresIn: 0
    },
    cors: true,

    handler: function(request, reply) {
        var info = {};
        info.noOfCollections = 0;
        info.collectionName = "";
        info.noOfDashBoardViews = 0;
        info.recentDashBoardViewName = "";

        var user = request.payload.userName;

        var getCollecCount = function(callback) {
            mongoDBUtil.model(user, 'metaData', 'defaultSchema').count({}, function(err, data) {
                info.noOfCollections = data;
                callback(err, info);
            });
        };

        var getCollecLastDoc = function(info, callback) {
            mongoDBUtil.model(user, 'metaData', 'defaultSchema').find({}, {
                "collectionName": 1
            }, function(err, data) {
                if (err || _.isEmpty(data)) {
                    callback(null, info);
                } else {
                    var finalData = JSON.parse(JSON.stringify(data[0]));
                    info.collectionName = finalData.collectionName;
                    callback(null, info);
                }
            }).limit(1).sort({
                $natural: -1
            });
        };

        var getViewCount = function(info, callback) {
            mongoDBUtil.model(user, 'views', 'defaultSchema').count({}, function(err, data) {
                info.noOfDashBoardViews = data;
                callback(err, info);
            });
        };

        var getViewLastView = function(info, callback) {
            mongoDBUtil.model(user, 'views', 'defaultSchema').find({}, {
                "viewName": 1
            }, function(err, data) {
                if (err || _.isEmpty(data)) {
                    callback(null, info);
                } else {
                    var finalData = JSON.parse(JSON.stringify(data[0]));
                    info.recentDashBoardViewName = finalData.collectionName;
                    callback(null, info);
                }
            }).limit(1).sort({
                $natural: -1
            });
        };

        async.waterfall([
            getCollecCount,
            getCollecLastDoc,
            getViewCount,
            getViewLastView
        ], function(err, result) {
            if (err) {
                reply(err);
            } else {
                reply(result);
            }

        });
    }
};

serviceManager.getUsers = {
    cache: {
        expiresIn: 0
    },
    cors: true,
    handler: function(request, reply) {
        mongoDBUtil.model('users', 'users', 'userSchema').find(request.payload.filter, request.payload.projection, function(err, results) {
            if (err) {
                reply(err);
            } else {
                reply(results);
            }
        });
    }
};


module.exports = [{
    path: '/myapp/',
    method: 'GET',
    config: serviceManager.index
}, {
    path: '/myapp/{file*}',
    method: 'GET',
    config: serviceManager.js
}, { // Login Component
    path: '/myapp/authenticate',
    method: 'POST',
    config: serviceManager.authenticate
}, { // Dashboad Component
    path: '/myapp/getDashBoardCollectionsData',
    method: 'POST',
    config: serviceManager.getDashBoardCollectionsData
}, {
    path: '/myapp/getUsers',
    method: 'POST',
    config: serviceManager.getUsers
}, {
    path: '/myapp/getPersonalityInfo',
    method: 'POST',
    config: serviceManager.getPersonalityInfo
}, {
    path: '/myapp/enrollImage',
    method: 'POST',
    config: serviceManager.enrollImage
}, {
    path: '/myapp/getPersonalityImage',
    method: 'POST',
    config: serviceManager.getPersonalityImage
}, {
    path: '/myapp/uploadImage',
    method: 'POST',
    config: serviceManager.uploadImage
}];
