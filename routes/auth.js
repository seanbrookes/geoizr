/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 06/11/12
 * Time: 10:08 PM
 * To change this template use File | Settings | File Templates.
 */
/*
 * GET home page.
 */
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	userName: { type: String, required: true },
	firstName: { type: String, required: false },
	lastName: { type: String, required: false },
	email: [],
	created: { type: Date, default: Date.now },
	modified: { type: Date, default: Date.now }
});

var UserModel = mongoose.model('User', User);
exports.login = function(req, res){
    console.log('[exports.login] Authorization request posted: ' + req.body.username);
	if (req.body && req.body.username){

		UserModel.findOne({userName:req.body.username},function(err,doc){
			if (doc){
				// log user in
				req.session.currentUser = {};
				req.session.currentUser.userName = doc.userName;
				req.session.currentUser.userId = doc._id;
				var objToJson = {};
				objToJson.currentUser = {};
				objToJson.currentUser.userName = req.session.currentUser.userName;
				objToJson.currentUser.userId = req.session.currentUser.userId;
				objToJson.isAuthSuccess = true;
				//res.write(JSON.stringify(objToJson));
				//res.writeHead(200, {"Content-Type": "application/json"});
				//res.header('Content-Type':'application/json');
				res.end(JSON.stringify(objToJson));
			}
			else{
				res.end(JSON.stringify({message:'usename was not found'}));
			}
		});

	}

};
