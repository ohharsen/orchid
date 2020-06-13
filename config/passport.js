var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var User = mongoose.model('User');

passport.use(new LocalStrategy(function(username, password, done){
    User.findOne({username: username}, function(err, user){
        if(err) return done(err);
        if(!user) return done(null, false, {message: 'Incorrect username'});
        if(!user.validatePassword(password)) return(null, false, {message: 'Incorrect Password'})
        return done(null, user);
    })
}));

passport.serializeUser(function(user,done){
    return done(null, user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id, done);
});

module.exports = passport;