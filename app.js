var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ghost = require('ghost');
var path = require('path');


var routes = require('./routes/index');
var users = require('./routes/users');

var parentApp = express(); //this is my current app.

//i hate putting this many things inside a .then function.
//i should probably organize this later.
// console.log(ghostConfig.development);
ghost({config:path.join(__dirname,'config.js')} ).then(function( ghostServer ){
  parentApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);
  ghostServer.start(parentApp);
  console.log(ghostServer.config.apiUrl());
  console.log(ghostServer);
// view engine setup
parentApp.set('views', path.join(__dirname, 'views'));
parentApp.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//parentApp.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
parentApp.use(logger('dev'));
parentApp.use(bodyParser.json());
parentApp.use(bodyParser.urlencoded({ extended: false }));
parentApp.use(cookieParser());
parentApp.use(require('less-middleware')(path.join(__dirname, 'public')));
parentApp.use(express.static(path.join(__dirname, 'public')));

parentApp.use('/', routes);
parentApp.use('/users', users);

// catch 404 and forward to error handler
parentApp.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (parentApp.get('env') === 'development') {
  parentApp.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
parentApp.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

});

module.exports = parentApp;
