var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Categories = mongoose.model('Category');
var router = express.Router();

router.get('/', function(req,res,next){
    Categories.find((err, categories) => {
        res.send({categories: categories});
    });
});

router.post('/delete', function(req,res,next){
    Categories.deleteOne(req.body.category, function(err){
        Categories.find((error, categories) => {
            res.send({categories: categories});
        });
    });

});

router.post('/', function(req,res,next){
    Categories.create({name: req.body.category},function(err, categories){
        Categories.find((error, categories) => {
            res.send({categories: categories});
        });
    });
});

module.exports = router;