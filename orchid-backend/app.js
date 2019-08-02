var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// set up the DB
var mongoDB = 'mongodb+srv://orchidUser:orchidPassword@cluster0-lthzs.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useCreateIndex: true});

// get default connection
var db = mongoose.connection;


// debug - DB error
db.on('error', function(err, result){
  console.log(err);
});

var Product = require('./models/product');
var Category = require('./models/category');
var Customer = require('./models/customer');
var Store = require('./models/store');
var Transactions = require('./models/transaction');
var User = require('./models/user');

var passport = require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'very secret secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// TODO set up session expiration

app.use('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users',
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.render('error');
});

module.exports = app;
