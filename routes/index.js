var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');
var User = require('../models/user');




/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];
     Product.find(function(err, result){

        var productSizes = [];
        var productSize = 3;

        for (var i = 0; i < result.length; i += productSize) {
            productSizes.push(result.slice(i, i + productSize))
        }

        res.render('shop/index', { title: 'Shopping Cart', products: productSizes, successMsg: successMsg, noMessages: !successMsg });
    })
});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  console.log(productId);
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
});

router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout', function (req, res, next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }

    var cart = new Cart(req.session.cart);

    console.log(req.session.cart)

    var stripe = require("stripe")(
        "sk_test_00valLNP8V7e9XUL8AAk9d3v"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: 'tok_visa', // obtained with Stripe.js
        description: "Test Charge"
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
         var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
         });

         console.log(order);
         order.save(function(err, result){
            req.flash('success', 'Successfully bought product');
            req.cart = null;
            res.redirect('/');
         });
    });
});

router.post('/add-product', function (req, res, next) {
    var product = req.body;
    console.log(product);
    if (!product)
        return res.json({status:0, message:'Invalid Product Payload'});
    var products = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imagePath: req.body.imagePath
    });
    products.save(function(err, product){
        if(product){
            return res.json({status:1, message:'Product Successfully Created'});
        }else{
             return res.json({status:0, message:'Product Not Successfully Created'});
        }
    })
});

router.get('/get-products', function(req, res, next){

    Product.find(function(err, result){
        res.json({status:1, data: result})
    });

});

router.post('/register', function(req, res, next){
    if(req.body.email && req.body.password){
        var user = {
            email: req.body.email,
            password: req.body.password
        }

        user.save(function(err, user){
            var user = this;

            bcrypt.hash(user.password, 10, function(err, hash){
                if(err){
                    return res.json({status:0, message:'Error'});
                }else{
                    user.password = hash;
                    next();
                }
            })
        })

        User.create(user, function(err, users){
            if(err){
                return res.json({status:0, message:'Error'})
            }else{
                return res.json({status:1, message:'User Added Successfully'})
            }
        });

    }
    // var user = req.body;

    // if(!user){
    //     return res.json({status:0, message:'User not found'})
    // }

    // var users = new User({
    //     email: req.body.email,
    //     password: bcrypt.hash(req.body.password)
    // });
    // users.save(function(err, user){
    //     if(user){
    //      return res.json({status:1, message:'User Successfully Created'});
    //     }else{
    //      return res.json({status:0, message:'User Not Successfully Created'});
    //     }
    // })
});

router.post('/login', function(req, res, next){
   var email = req.body.email;
   var password = req.body.password

    User.findOne({email: email})
        .exec(function(err, user){
            if(err){
                return res.json({status:0, message:'Error'})
            }else if(!user){
                return res.json({status:0, message: 'User not found'});
            }
            bcrypt.compare(password, user.password, function(err, result){
                if(result === true){
                    return res.json({status:1, message:'Login Successful'});
                }else{
                    return res.json({status:0, message: 'Login failed'});
                }
            })
        }) 
});

router.get('/users', function(req, res, next){

    User.find(function(err, result){
        res.json({status:1, data: result})
    });

});

router.post('/checkouts', function(req, res, next){
    
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_00valLNP8V7e9XUL8AAk9d3v"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: 'tok_visa', // obtained with Stripe.js
        description: "Test Charge"
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
         var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
         });
         order.save(function(err, order){
            if(err){
                res.json({status:1, message:'Successfully bought Product'})
            }else{
                res.json({status:0, message:'Successfully not bought Product'})
            }
            
         });
    });

});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  console.log(productId);
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Product.findById(productId, function(err, product){
    if(err){
        return res.json({status:0, message:'Error'});
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    return res.json({status:1, message:'Cart Successfully Added'})
  })
});


module.exports = router;
