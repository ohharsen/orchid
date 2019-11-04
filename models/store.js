var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StoreSchema = new Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    }
});


module.exports = mongoose.model('Store', StoreSchema);