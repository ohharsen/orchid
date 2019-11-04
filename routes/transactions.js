var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Sell = mongoose.model('Sell');
var Return = mongoose.model('Return');
var Transaction = mongoose.model('genericTransaction');
var Category = mongoose.model('Category');
var Customer = mongoose.model('Customer');
var router = express.Router();


router.get('/', function(req,res,next){
    if(req.user){
        var stores = req.user.stores.map(function(val){
            return val._id;
        });
        
    Promise.all([
        Sell.find(),
        Return.find(),
        User.findById(req.user._id)
                .populate('stores'),
        Category.find(),
        Transaction.find()
        .populate('store')
        .populate('customer')
        .populate({
            path: 'products.product',
            model: 'Product'
        })
    ])
    .then(response=> {

        [sellTransactions, returnTransaction, stores, categories, transactions] = response;
        res.send({sellTransactions, returnTransaction, stores, categories, transactions}).end();
    })
    .catch(err => console.log(err));
}
});

router.post('/new', function(req, res, next){
    var products = req.body.products;
    var customer = req.body.customer &&  mongoose.Types.ObjectId(req.body.customer._id);
    var store = mongoose.Types.ObjectId(req.body.store);
    products.forEach((prod)=>{
        prod.quantities.forEach(val=>{
            if(val.store == store){
                val.quantity -= prod.quantity;
            }
        })
    });
    var user = req.user._id
    var discount = req.body.discount;
    products = products.map((val)=>{
        return  {product: JSON.parse(JSON.stringify(val)), quantity: val.quantity}
    }
    );
    Sell.create({products, customer, store, user, discount},function(err, transaction){
        if(err) console.log(err)
        async.parallel(products.map(val=>{
            return function(cb){
                Product.findByIdAndUpdate(val.product._id, val.product, cb)
            }
        }), (errors, results)=>{
            if(errors) console.log(errors)
            else {
                Customer.findByIdAndUpdate(customer, {$inc: {'sales': products.reduce((acc=0, val) => acc+(val.quantity*val.product.price), 0)}}, (err, result)=>{
                    if(err) console.log(err)
                    else return res.status(200).send(result);
                })
            }
        })
    });
});

router.put('/update', function(req,res,next){

});

router.delete('/', async function(req, res, next){
    
});

module.exports = router;