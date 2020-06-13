var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Store = mongoose.model('Store');
var router = express.Router();

router.get('/', function(req, res, next){
    User.findById(req.user._id)
        .populate('stores')
        .exec(function(err, user){
            res.send({stores: user.stores});
    });
});

router.post('/delete', function(req,res,next){
    console.log(req.body.store);
    User.findById(req.user._id, (err, user) =>{
        user.stores.splice(user.stores.indexOf(req.body.store), 1);
        user.save((error, result)=>{
            result.populate('stores').execPopulate((poper, popres)=>{
                if(err)
                 res.send(error);
                else
                    res.send({stores: popres.stores});
            });
            
        });
    });

});

router.post('/', function(req,res,next){
    console.log(req.body);
    User.findById(req.user._id, (err, user) =>{
        Store.create({name: req.body.store}, (sterr, stres)=>{
            user.stores.push(stres);
            user.save((error, result)=>{
                result.populate('stores').execPopulate((poper, popres)=>{
                    if(err)
                     res.send(error);
                    else
                        res.send({stores: popres.stores});
                });
            });
        })
    });
});

module.exports = router;