var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var router = express.Router();

/* GET users listing. */
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {return res.status(403).end();}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(200).end();
    });
  })(req, res, next);
});

router.get('/', function(req,res,next){
  if(req.user){ 
    let user = req.user;
    delete user.password;
    return res.status(200).send({user: user});
}
  return res.status(403).end();
});

router.get('/users', function(req,res,next){
  if(req.user.role=="Admin"){ 
    User
    .find({}, {password: 0})
    .exec((err, users) =>{
        res.status(200).send({
          users: users,
          user: req.user
        });
    })
}
});

router.post('/delete', function(req,res,next){
  console.log(req.body);
    if(req.user.role=="Admin"){ 
      User
      .deleteOne({_id: req.body.user})
      .exec((err) =>{
        User.find()
        .exec((err, users)=>{
          res.status(200).send({users: users});
        }) 
      })
    }
});

router.post('/logout', function(req,res,next){
    if(req.user){
    req.logout();
    return res.status(200).end();
  }
  else{
    res.status(500);
  }
});

module.exports = router;
