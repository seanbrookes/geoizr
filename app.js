
/**
 * Module dependencies
 *
 * Adding a test comment
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, geostatic = require('./routes/geostatics')
	, geocode = require('./routes/geocode')
	, receipts = require('./routes/receipts')
	, auth = require('./routes/auth')
	, http = require('http')
	, mongoose = require('mongoose')
	, path = require('path');

var Session = require('connect-mongodb');
var app = express();

/**
 *
 *  Uncaught exceptions
 *
 */
//process.on('uncaughtException',function(err){
//    console.log('[app.js] Caught- uncaught exception (try to keep application running): ' + err);
//});

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:'sercret key'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var roleFactory = function(role){
    return function(req, res, next){
        if (req.session.fole && req.session.role.indexOf(role) !== -1){
           next();
        }
        else{
            res.send('You are not authenticated.');
        }
    };
};
/**
 * Routes
 */
app.post('/auth',express.bodyParser(),auth.login);
app.get('/currentuser', user.getCurrentUser);
app.get('/users', user.getAllUsers);
app.post('/users', user.addUser);
app.get('/geostatics', geostatic.getGeostatics);
app.get('/geostatics/:id', geostatic.getGeostatic);
app.put('/geostatics/:id', express.bodyParser(), geostatic.updateGeostatic);
app.post('/geostatics', express.bodyParser(), geostatic.newGeostatic);

app.get('/geocode', geocode.getGeoCode);
app.post('/geocode', express.bodyParser(), geocode.postGeoCodeAddress);
app.delete('/geostatics/:id', geostatic.deleteGeostatic);
app.get('/receipts',receipts.getCanvas);


http.createServer(app).listen(app.get('port'), function(){
	console.log('|--------------------------------');
	console.log('|');
	console.log('|');
	console.log('|');
	console.log('|');
	console.log('|');



	console.log("|	Geostatic app server listening on port " + app.get('port'));
	console.log('|');
	console.log('|');
	console.log('|	Initialize geostatics Db connection');
	console.log('|');
	try{
		mongoose.connect('mongodb://localhost:27017/geostatics',function(err){
			console.log('|');
			if(err){
				console.log('|');
				console.log('|');
				console.log('--------------------------------');
				console.log('|	geostatics [mongo] connection error : ' + err);
				console.log('--------------------------------');
				console.log('|');
			}
			else{
				console.log('|');
				console.log('|	Connected to Mongo');
				console.log('|');
				console.log('|');
			}
			console.log('|==========================================');
			console.log('|==========================================');
			console.log('|');
			console.log('|');

		});
	}
	catch(e){
		console.log('exception block trying to initialize a db connection');
	}

});
