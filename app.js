var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var morgan = require('morgan');
var cors = require('cors');
var errorhandler = require('errorhandler');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Current environment
// app.get('env') equls process.env.NODE_ENV
var NODE_ENV = app.get('env') || 'production';

app.use(favicon(path.join(__dirname, './public/favicon.ico')));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(compress());
// the default is "/" capture the static dir as all static resource root.
app.use("/static", cors(), express.static(path.join(__dirname, './public')));
app.use("/examples", cors(), express.static(path.join(__dirname, './examples')));
// The testing purpose for  `react-sample`
app.get("/workspace/list", function (req, res) {
  var initialState = {
    workspaces: {
      isLoading: false,
      list: [{
        "id": 1,
        "name": "workspace name 1"
      }, {
        "id": 2,
        "name": "workspace name 2"
      }, {
        "id": 3,
        "name": "workspace name 3"
      }, {
        "id": 4,
        "name": "workspace name 4"
      }]
    },
    workspaceOthers: ''
  };
  var html = '<!DOCTYPE html>' +
    ' <html>' +
    '  <head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="renderer" content="webkit">' +
    '  <meta http-equiv="Cache-Control" content="no-siteapp">' +
    '  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">' +
    '  <link rel="stylesheet" type="text/css" href="http://localhost:3000/public/workspace/wslist/bundle.css">' +
    '</head>' +
    '  <body>' +
    '    <script>window.__INITIAL_STATE__ = ' + JSON.stringify(initialState) + '</script>' +
    '    <div id="react-view"></div>' +
    '    <script src="http://localhost:3000/public/browser-polyfill.js"></script>' +
    '    <script src="http://localhost:3000/public/reactkits.js"></script>' +
    '    <script src="http://localhost:3000/public/workspace/wslist/bundle.js"></script>' +
    '  </body>' +
    '</html>';

  res.send(html);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('404 Not Found!');
  err.status = 404;
  next(err);
});
// only use in development
if (NODE_ENV === 'development') {
  console.log('===Note: the app now in debug mode===');
  app.use(errorhandler());
}

module.exports = app;
