var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Category = mongoose.model('Category');
var router = express.Router();

router.get('/', function(req,res,next){
    if(req.user){
        var stores = req.user.stores.map(function(val){
            return val._id;
        });
        Product.find()
        .where('quantities').elemMatch({store: {$in: stores}})
        .exec(function(err, products){
            return res.send(products).end();
        });
    }
    else{
        return res.status(403).end();
    }
});

router.post('/new', function(req, res, next){
    // Product.create(req.body.product, function(err){
    //     res.err(err);
    // })
    console.log(req.body.product);
});

router.get('/new',function(req, res, next){
    User.findById(req.user._id)
    .populate('stores')
    .exec(function(err, stores){
        Category.find()
        .exec(function(err, categories){
            res.send({stores: stores, categories: categories});
        });
    })
});

router.delete('/', async function(req, res, next){
        async.each(req.body.products, function(item, cb){
            Product
            .findByIdAndRemove(item, function(err){
                if(err) cb(err);
                cb();
            })  
        }, function(err){
            if(err) next(err);
            var stores = req.user.stores.map(function(val){
                return val._id;
            });
            Product.find()
            .where('quantities').elemMatch({store: {$in: stores}})
            .exec(function(err, products){
                res.send(products).end();
            });
        });
});

module.exports = router;