var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors'); 
var bodyParser = require('body-parser');


var Product = require('./models/product');
var Category = require('./models/category');
var Customer = require('./models/customer');
var Store = require('./models/store');
var Transactions = require('./models/transaction');
var User = require('./models/user');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var inventoryRouter = require('./routes/inventory');
var customerRouter = require('./routes/customers');
var transactionRouter = require('./routes/transactions');
var storeRouter = require('./routes/stores');
var categoryRouter = require('./routes/categories');

var app = express();

// set up the DB
var mongoDB = 'mongodb+srv://orchidUser:orchidPassword@cluster0-lthzs.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});

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

// Category.create([{name: 'pants'}, {name: 't-shirt'}, {name: 'shoes'}, {name: 'bags'}], function(err, res){
//   if(err) console.log(err);
//   else console.log(res);
// })

// Store.find({name: 'bessini'}, function(err, store){
//     //console.log(store[0]._id);
    
//   });

  // var newCust = new Customer({first_name: 'Arsen', last_name: 'Ohanyan', phone_number: '818-518-7085', email: 'arsenohanyan@gmail.com', store: mongoose.Types.ObjectId('5d4f865ce93a965efc24c0a6'), card_number: '?sadasd65187'});
  // newCust.save(function(err, cust){
  //   err ? console.log(err) : console.log(cust);
  // })

  // Store.find().then(stores => 
  //   User.findOneAndUpdate({username: 'gagueik'}, {stores: [...stores]}, function(err, user){
  //         console.log(user);
  //   })
  //   );
  Store.find({name: 'bessini'}, function(err, store){
  User.create({name: 'gagulik', username: 'gagupik', password: 'gagulik', role: 'Employee', stores: store[0]._id}, function(err, user){
      console.log(user);
  });
  })


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

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// TODO set up session expiration

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory', inventoryRouter);
app.use('/customers', customerRouter);
app.use('/transactions', transactionRouter);
app.use('/stores', storeRouter);
app.use('/categories', categoryRouter);

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
