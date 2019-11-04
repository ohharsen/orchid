var express = require('express');
var passport = require('passport');
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
