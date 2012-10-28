
/**
 * Module dependencies
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , geostatic = require('./routes/geostatics')
  , http = require('http')
  , moment = require('moment')
  , mongoose = require('mongoose')
  , path = require('path');

var Session = require('connect-mongodb');
var app = express();

/**
 *
 *  Uncaught exceptions
 *
 */
process.on('uncaughtException',function(err){
    console.log('Caught- uncaught exception (try to keep application running): ' + err);
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
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

app.get('/users', user.list);
app.get('/geostatics', geostatic.getGeostatics);
app.get('/geostatics/:id', geostatic.getGeostatic);
app.get('/', routes.index);
app.put('/geostatics/:id', express.bodyParser(), geostatic.updateGeostatic);
app.post('/geostatics', express.bodyParser(), geostatic.newGeostatic);
app.delete('/geostatics/:id', geostatic.deleteGeostatic);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
