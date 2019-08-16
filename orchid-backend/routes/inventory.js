var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var Product = mongoose.model('Product');
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

router.delete('/', async function(req, res, next){
    if(req.user){
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
        })
    }
    else{
        return res.status(403).end();
    }
});

 function deleteProduct(prodID){
   
    Product
    .findByIdAndRemove(prodID, function(err){
        if(err) reject(err);
        resolve(true);
    })
}

module.exports = router;