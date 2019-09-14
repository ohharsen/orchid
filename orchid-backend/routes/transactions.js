var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Sell = mongoose.model('Sell');
var Store = mongoose.model('Store');
var Customer = mongoose.model('Customer');
var router = express.Router();


router.get('/', function(req,res,next){
    
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
    console.log(products.reduce((acc=0, val) => acc+(val.quantity*val.price), 0))
    Sell.create({products, customer, store, user, discount},function(err, transaction){
        if(err) console.log(err)
        async.parallel(products.map(val=>{
            return function(cb){
                Product.findByIdAndUpdate(val._id, val, cb)
            }
        }), (errors, results)=>{
            if(errors) console.log(errors)
            else {
                Customer.findByIdAndUpdate(customer, {$inc: {'sales': products.reduce((acc=0, val) => acc+(val.quantity*val.price), 0)}}, (err, result)=>{
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