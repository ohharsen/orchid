var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors'); 

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

// User.create({name: 'gagulik', username: 'gagushik', password: 'gagulik', role: 'Admin'});

var passport = require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'very secret secret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
})); //Debug

// TODO set up session expiration

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {return res.status(403).end();}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(200).end();
    });
  })(req, res, next);
});

app.get('/login', function(req,res,next){
  if(req.user) return res.status(200).end();
  return res.status(403).end();
});

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
