var express		= require('express');
var fs 			= require('fs');
var bodyParser 	= require('body-parser');
var session 	= require('cookie-session');
var morgan  	= require('morgan');
var compression = require('compression');

var properties	= undefined;
var app 		= module.exports = express();
var server 		= require('http').createServer(app);
eval(fs.readFileSync('settings.json', 'utf8'));

GLOBAL.app = app;
GLOBAL.express = express;
GLOBAL.properties = properties;


// Configuration
app.disable('x-powered-by');

// Logger token for small date
if ( !fs.existsSync("./logs")) {
	fs.mkdirSync("./logs");
}
var access_logfile = fs.createWriteStream('./logs/access.log', {flags: 'a'});
morgan.token('tinydate', function(req){ return new Date().toJSON(); });
app.use(morgan( { format: ' [:tinydate] :remote-addr - :method :url :status - :response-time ms', stream : access_logfile} ));

// Compression
app.use(compression());

// Body parser => Convert request into body params
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// Session management
app.use(session({
  secret : 'B00bs-Spotipocjfkhadsfljbdsavhjdsavbdfdasfd',
  name : 'joe-session'
}));

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');

if('development' == app.get('env')){
	properties = settings.DEV;
    console.log("Environnement - DEV");
};

if('production' == app.get('env')){
	properties = settings.PROD;
    console.log("Environnement - PROD !");  
};

// Error handling
app.use(logErrors);
app.use(clientErrorHandler);


/**
 * Error logging
 */
 function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

/**
 * Rest error handling (xhr)
 */
 var TECHNICAL_ERROR = "A technical error occured...";
function clientErrorHandler(err, req, res, next) {
  // xhr / application-json = REST
  // if (req.xhr || req.is('application/json') ){
    if(err.technical){
      res.send(500, { errors: TECHNICAL_ERROR });  
    }else{
      if(err.code){
        res.send(err.code, { errors: err.message });
      }else{
        res.send(500, { errors: err.message });
      }
      
    }
  // } else {
  //   next(err);
  // }
}

/**
 * All error handling
 */
 function errorHandler(err, req, res, next) {
  res.status(500);
  if(err.technical){
    res.render("index.html", {locals : { errors: TECHNICAL_ERROR } });
  }else{
    res.render("index.html", {locals : { errors: err.message } });
  }
}

/** 
 * Index route configuration
 */
app.get('/', function (req, res) {
	res.render("index.html", {locals : { isAdmin : req.session.isAdmin } });
});

/* id parameter must always be an integer */
 app.param(function(name, fn){
  if (fn instanceof RegExp) {
    return function(req, res, next, val){
      var captures;
      if (captures = fn.exec(String(val))) {
        req.params[name] = parseInt(captures);
        next();
      } else {
        next('route');
      }
    }
  }
}); 
app.param('id', /^\d+$/);


// Routes pour services
require('./services.js');


/**
 * 404 page handling
 */
 app.use(function(request, response, next){
  response.send(404, "Are you lost ?");
 });


/**
 * Determine si une chaine est vide ou non
 */
 GLOBAL.isEmpty = function isEmpty(v){
  return v == undefined || v.length < 1;
 }

server.listen(properties.port);
console.log('['+ new Date().toJSON() +'] Running on http://localhost:' + properties.port + "/");
