var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/geostatics',function(err){
//    if(err){
//        console.log('--------------------------------');
//        console.log('Mongo Connection ERROR : ' + err);
//        console.log('--------------------------------');
//    }
//    else{
//        console.log('Connected to db');
//    }
//});
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
/*
 * GET users listing.
 */


exports.getAllUsers = function(req, res){
	console.log('[exports.getAllUsers] Get all users Request');
	UserModel.find(function(err,docs){
		console.log('[exports.getAllUsers] all users: ' + docs);
		console.log('[exports.getAllUsers] end all users -----------------------');
		res.send(docs);
	});
	//res.end(JSON.stringify(objToJson));
};
exports.getCurrentUser = function(req, res){
    console.log('[exports.getCurrentUser] Get Current User Request');
	try{
		var objToJson = {};
		objToJson.currentUser = {};

		console.log('[exports.getCurrentUser] inside the get user try block');
		if (req.session.currentUser){
			console.log('[exports.getCurrentUser] there is a current user on session obj: ' + req.session.currentUser);
			objToJson.currentUser = req.session.currentUser;
			objToJson.currentUser.userName = req.session.currentUser.userName;

			console.log('[exports.getCurrentUser] try to find user: ' + req.session.currentUser.userName);

			UserModel.findOne({userName:req.session.currentUser.userName},function(err,doc){
				if(!err){
					objToJson.currentUser = doc;
				}
				else{
					console.log('[exports.getCurrentUser] error getting current user from the db');
					objToJson.message =  'error getting current user from the db';

				}

			});
		}
		else{
			objToJson.message = 'there is no current user';
			console.log('[exports.getCurrentUser] there is no current user on session obj');
		}
		res.end(JSON.stringify(objToJson));
	}
	catch(e){
		console.log('[exports.getCurrentUser] There was an error getting the current user from req.session: ' + e.message);
		res.end('there was an error getting current user: ' + e.message);
	}
	// res.end(JSON.stringify(objToJson));
};
exports.addUser = function(req, res){

    if (req.body && req.body.userName){
        console.log('[exports.addUser] Add user post: ' + req.body.userName);
        var newUser = new UserModel({
            userName: req.body.userName
        });
        console.log('[exports.addUser] Add user post 1: ' + newUser.userName);

        UserModel.count({'userName':newUser.userName}, function(err,count){
			if (count > 0){
				console.log('[exports.addUser] User already Exists ' + newUser);
				var resObj = {};
				resObj.message = '[exports.addUser] User already exists';
				res.send(resObj);
			}
			else{
				console.log('[exports.addUser] No user found - create user: ' + newUser);
				newUser.save(function (err) {
					if (!err) {
						console.log('[exports.addUser] newUser model created: ' + newUser);
						res.send(newUser);

					}
					else {
						console.log('[exports.addUser] save newUser model failed: ' + err);
					}

				});
			}
        });
//        UserModel.find({'userName':req.body.userName}, function(err,docs){
//            if (docs){
//
//            }
//            else{
//
//            }
//
//        });
//        UserModel.find(function(err,newUser){
//            console.log('FOUND USER? 1a: ' + newUser.userName);
//            if(newUser.userName == undefined){
//                console.log('newUser.userName 1b: ' + newUser.userName);
//                newUser = new UserModel({
//                    userName: req.body.userName
//                });
//
//                console.log('Save user: ' + newUser.userName);
//                newUser.save(function (err) {
//                    console.log('Add user post 3: ' + newUser.userName);
//
//                    if (!err) {
//                        console.log('Add user post 4: ' + newUser.userName);
//                        console.log("newUser model created: " + newUser);
//                        res.send(newUser);
//
//                    } else {
//                        console.log('Add user post 5: ' + newUser.userName);
//                        console.log('save newUser model failed: ' + err);
//                    }
//                    console.log('Add user post 6: ' + newUser.userName);
//
//                });
//            }
//            else{
//                console.log('Add user post 7: ' + newUser.userName);
//                console.log('user exists: ' + newUser);
//                res.send('user already exists: ' + newUser);
//
//            }
//            console.log('Add user post 8: ' + newUser.userName);
//        });







    }
    else{
        console.log('[exports.addUser] request to create new user but no user name was supplied');
    }

    //res.end(JSON.stringify(objToJson));
};