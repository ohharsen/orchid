var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var options = {discriminatorKey: 'type'};

var genericTransactionSchema = new Schema({
    date: {
        type: Date, 
        default: new Date(), 
        immutable: true,
    },
    products: [{
    product: {
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}],
    customer: {
        type: Schema.Types.ObjectId, 
        ref: 'Customer'
    },
    store: {
        type: Schema.Types.ObjectId, 
        ref: 'Store',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
}, options);

 var genericTransaction = mongoose.model('genericTransaction', genericTransactionSchema);

 var SellSchema =new Schema(
     {
         discount: { 
          type: Number,  
          required: true,  
          min: 0
        },
        returned: {
            type: Boolean,
            default: false,
        }
    }, options);

 var Sell = genericTransaction.discriminator('Sell', SellSchema);

var ReturnSchema = new Schema(
    { 
        sold_transaction: {
             type: Schema.Types.ObjectId,  
             ref: 'Transaction',
             required: true,
            }
    }, options);

ReturnSchema
.pre('save', function(next){
    genericTransaction.findById(this.sold_transaction).exec(function(error, transaction){
        if(error)
            next(error);
        else if(transaction.returned)
            next(new Error('This item has already been returned'));
        else{
            transaction.returned = true;
            transaction.save(function(err){
                if(err)
                    next(err);
            });
        }
    })
});

var Return = genericTransaction.discriminator('Return', ReturnSchema);


module.exports = {
    genericTransaction: genericTransaction,
    sellTransaction: Sell,
    returnTransaction: Return
};