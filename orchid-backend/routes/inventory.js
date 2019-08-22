var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Category = mongoose.model('Category');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file');

router.get('/', function(req,res,next){
    if(req.user){
        var stores = req.user.stores.map(function(val){
            return val._id;
        });
        Product.find()
        .where('quantities').elemMatch({store: {$in: stores}})
        .exec(function(err, products){
            User.findById(req.user._id)
                .populate('stores')
                .exec(function(err, user){
                    Category.find()
                    .exec(function(err, categories){
                        res.send({stores: user.stores, categories: categories, products: products});
                    });
                })
        });
    }
    else{
        return res.status(403).end();
    }
});

router.post('/new', function(req, res, next){
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return console.log(err)
        } else if (err) {
            return console.log(err)
        }
      var image = fs.readFileSync(req.file.path);
      req.body.product = JSON.parse(req.body.product);
      req.body.product.image = image;
      Product.create(req.body.product,function(error,result){
          if(error) console.log(error)
          else{
            var stores = req.user.stores.map(function(val){
                return val._id;
            });
            Product.find()
                .where('quantities').elemMatch({store: {$in: stores}})
                .exec(function(err, products){
                return res.status(200).send({products: products});
                });
          }
      });
 })

 
});

router.get('/new',function(req, res, next){
    
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