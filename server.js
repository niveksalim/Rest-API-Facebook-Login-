/**
 * Created by kevin.salim on 3-4-2016.
 */

var express = require('express');
var app = express();
var AccountHandler = require('./handlers/AccountHandler');
var AuthenticationHandler = require('./handlers/AuthenticationHandler');
var routes = require('./routes');
var securityPolicy = require('./securityPolicy');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./Config-debug');

mongoose.connect(config.db.mongodb);
app.use(express.static(path.join(__dirname, 'public')));

// Configuration
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var handlers = {
    account: new AccountHandler(),
    auth: new AuthenticationHandler()
};

routes.setup(app, handlers, securityPolicy.authorise);
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);