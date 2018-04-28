'use strict'

// https://www.twilio.com/blog/2017/11/securing-your-express-app.html

var express = require('express');
var helmet = require('helmet');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
const csp = require('express-csp-header');

const cspMiddleware = csp({
    policies: {
      'default-src': [csp.NONE],
      'script-src': [csp.NONCE],
      'style-src': [csp.NONCE],
      'img-src': [csp.SELF],
      'font-src': [csp.NONCE, 'fonts.gstatic.com'],
      'object-src': [csp.NONE],
      'block-all-mixed-content': true,
      'frame-ancestors': [csp.NONE]
    }
  });

var app = express();

app.use(helmet({
    dnsPrefetchControl: { allow: true },
    frameguard: { action: 'deny'}
}));

app.use(cspMiddleware);

app.use('/',function(req,res){
    res.status(200).send({message:"Hello world"});
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
  });

  module.exports = app;
