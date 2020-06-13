var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true,
        enum: ['Admin', 'Employee']
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    stores: [{
        type: Schema.Types.ObjectId,
        ref: 'Store'
    }]
  });


UserSchema
.virtual('url')
.get(() => '/users/' + this._id);

UserSchema
.pre('save', function(next){
    var user = this;
    bcrypt.hash(this.password, 10, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.methods.validatePassword = function(comparePassword, cb){
    return bcrypt.compare(comparePassword, this.password, cb);
}

module.exports = mongoose.model('User', UserSchema);