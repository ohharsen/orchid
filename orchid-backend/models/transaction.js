var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    date: {
        type: Date, 
        required: true
    },
    product: {
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
    },
    price_sold: {
        type: Number, 
        required: true, 
        min: 0
    },
    customer: {
        type: Schema.Types.ObjectId, 
        ref: 'Customer'
    },
    store: {
        type: Schema.Types.ObjectId, 
        ref: 'Store'
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
});

TransactionSchema
.virtual('type')
.get(function(){
    return this.price_sold > 0 ? 'sale' : 'return';
});

TransactionSchema
.virtual('discount')
.get(function(){
    return this.price_sold > 0 ? 'sale' : 'return';
});

// TODO dicount; type; 

module.exports = mongoose.model('Transaction', TransactionSchema);