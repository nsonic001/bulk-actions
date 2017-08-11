var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var __ = require('underscore');
var app = express();

var env_var = app.get('env');

console.log("\n\n******************************************");
console.log("Starting Bulk Action Serice : ", Date());
console.log("Environment Chosen :  ", env_var);
console.log("******************************************\n\n");

// determine Staging instance from commandline args
if (env_var == "staging") {
  env_var = process.argv[2] || "staging";
  console.log("Selecting Staging : ", env_var);
}


///////////////////
// Setup Configs //
///////////////////
global.config = require('./configs/' + env_var + '.js');
//- extend common config
let common_config = require('./configs/common.js');
__.extend(global.config, common_config);
//- extends secrets
const secret_config = require('./configs/secrets.js');

console.log("------secret_config------", secret_config);

if (env_var === 'production') {
  __.extend(global.config, secret_config.production);
} else {
  __.extend(global.config, secret_config.staging);
  console.log("-------global.config----", global.config.db);
}

// Database Config files
require('./configs/db');

// Get body elements from json and post requests
app.use(bodyParser.json({
  limit: '30mb'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '30mb'
}));

app.use(cookieParser());
app.use(cookieParser());

var userMiddleware = require('./middleware/user');
app.use('/', userMiddleware.authorize);

// Global variable used in base controller :p
global.globalRoutes = {};
var routes = require('./routes/index');
app.use('/', routes);

////////////////////
// error handlers //
////////////////////

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
//if (env_var === 'development') {
app.use('/error', (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
  next();
});
//}


module.exports = app;