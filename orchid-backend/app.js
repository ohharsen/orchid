var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors'); 

var Product = require('./models/product');
var Category = require('./models/category');
var Customer = require('./models/customer');
var Store = require('./models/store');
var Transactions = require('./models/transaction');
var User = require('./models/user');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var inventoryRouter = require('./routes/inventory');

var app = express();

// set up the DB
var mongoDB = 'mongodb+srv://orchidUser:orchidPassword@cluster0-lthzs.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useCreateIndex: true});

// get default connection
var db = mongoose.connection;


// debug - DB error
db.on('error', function(err, result){
  if(err) throw(err);
});

// Store.find({name: 'bessini'}, function(err, store){
//   //console.log(store[0]._id);
//   User.find({name: 'gagulik', username: 'gagueik', password: 'gagulik', role: 'Admin', stores: store[0]._id}, function(err, user){
//     Product.create({name: 'yubochka', sku: '1121512', price: 1500, quantities: [{store: store[store.length-1]._id, quantity: 5}]}, function(err, result){
//       console.log(err);
//     })
//   });
// });

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
var whitelist = ['http://localhost:3000', 'http://172.20.10.1']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};
app.use(cors({
  origin: corsOptions.origin,
  credentials: true,
})); //Debug

// TODO set up session expiration

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory', inventoryRouter);

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
