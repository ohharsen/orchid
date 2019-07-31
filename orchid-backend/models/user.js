var mongoose = require('mongoose');

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
        trim: true
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
        ref: Store
    }]
  });

//TODO encryption before save; limited role validation;

UserSchema
.virtual('url')
.get(() => '/users/' + this._id);

module.exports = mongoose.model('User', UserSchema);