var mongoose = require('mongoose');

module.exports = {
	defaultSchema: mongoose.Schema({
	    strict: false
	}),
	mailBoxSchema: mongoose.Schema({
	    from: 'string',
	    to: 'string',
	    receivedOn: { type: Date, default: Date.now },
	    sentOn: { type: Date, default: Date.now },
	    state: 'string',
	    subject: 'string',
	    content: 'string'
	}),
	userSchema: mongoose.Schema({
	    userjob: 'string',
	    usercontact: 'string',
	    userpass: 'string',
	    usertype: 'string',
	    userimg: 'string'
	}),
	jobMetaDataSchema: mongoose.Schema({
	    FileName: 'string',
	    UploadedBy: 'string',
	    UploadedOn: Date,
	    Path: 'string',
	    NodeServer: 'string',
	    PythonClient: 'string',
	    Status: 'string',
	    SheetIds: 'object'
	})
};