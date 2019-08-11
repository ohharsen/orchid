var express = require('express');
var mongoose = require('mongoose');
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

module.exports = router;