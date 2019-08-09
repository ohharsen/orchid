var express = require('express');
var mongoose = require('mongoose');
var Product = mongoose.Model('Product')
var router = express.Router();

router.get('/', function(req,res,next){
    if(req.user){
        Product.find({store: {$elemMatch: {$in: req.user.stores}}}, function(err, products){
            console.log(products);
        });
    }
    else{
        return res.status(403).end();
    }
});

module.exports = router;