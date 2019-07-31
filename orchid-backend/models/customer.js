var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    first_name: {
        type: String, 
        required: true, 
        max: 100,
        trim: true
    },
    last_name:  {
        type: String, 
        required: true, 
        max: 100,
        trim: true
    },
    phone_number: {
        type: String, 
        required: true, 
        max: 20,
        trim: true,
        validate: {
            validator: function(v){
                return /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/.test(v);
            },
            message: 'Phone number not of appropriate format'
        }
    },
    email: {
        type: String,
        trim: true,
        validate: {
            validator: function(v){
                return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
            },
            message: 'Email number not of appropriate format'
        }
    },
    date_joined: Date,
    sales: Number,
    store: {
        type: Schema.Types.ObjectId, 
        ref: 'Store'
    },
    card_number: {
        type: String,
        trim: true
    },
    avatar: Buffer
});

// TODO discount virtual

ProductSchema
.virtual('url')
.get(function(){
    return '/customers/' + this._id;
});

ProductSchema
.virtual('name')
.get(function(){
    return this.first_name + ' ' + this.last_name;
});

ProductSchema
.virtual('discount')
.get(function(){
    return 5 + Math.floor(this.sales/1000); 
    /*
    The minimum discount for any customer is 5% and 1% is added for each $1000 of sales
    It will be left this way until discount rules are added
    */
});

module.exports = mongoose.model('Customer', CustomerSchema);