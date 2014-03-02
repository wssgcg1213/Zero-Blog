 
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var settings = require('./settings');

var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});
var nb = express();

// all environments
nb.set('port', process.env.PORT || 8888);
nb.set('views', path.join(__dirname, 'views'));
nb.set('view engine', 'ejs');
nb.use(flash());
nb.use(express.favicon("./public/images/favicon.ico"));
nb.use(express.logger('dev'));
nb.use(express.logger({stream: accessLog}));
//nb.use(express.logger({stream: accessLog}));
//nb.use(express.bodyParser({ keepExtensions: true, uploadDir: './public/images' }));
nb.use(express.json());
nb.use(express.urlencoded());
nb.use(express.methodOverride());
nb.use(express.cookieParser());
nb.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db,
    cookie: {maxAge: 1000 * 3600 * 24 * 7},
    store: new MongoStore({
        db: settings.db,
        username: settings.user,
        password: settings.password
    })
}));
nb.use(nb.router);
nb.use(express.static(path.join(__dirname, 'public')));

nb.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});

// development only
if ('development' == nb.get('env')) {
  nb.use(express.errorHandler());
}

routes(nb);

http.createServer(nb).listen(nb.get('port'), function(){
  console.log('Express server listening on port ' + nb.get('port'));
});
