'use strict';
// Require our dependencies
var express = require('express'),
  http = require('http'),
  //config = require('./config'),
  reactViews = require('express-react-views'),
  moduleWatcher = require('./webservices/module_watcher.js'),
  homeRouter = require('./routes/home.js'),
  folderRouter = require('./routes/folder.js');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 6767;

// Set express-react-views as the templating engine
app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());

// Disable etag headers on responses
app.disable('etag');

// Index Route
app.use('/', homeRouter(app.get('env')));

// Folder Route
app.use('/folder', folderRouter);

// Set /public as our static content dir
app.use('/', express.static(__dirname + '/public/'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handling middleware should be loaded after the loading the routes
//
// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

// Initialize socket.io
var wsio = require('socket.io').listen(server);

moduleWatcher(wsio);
