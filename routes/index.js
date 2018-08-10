var express = require('express');
var router = express.Router();
var Product = require('../models/product.js');
var Cart = require('../models/cart.js');



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
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    console.log(product.id);
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

    var stripe = require("stripe")(
        "sk_test_00valLNP8V7e9XUL8AAk9d3v"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        req.flash('success', 'Successfully bought product');
        req.cart = null;
        res.redirect('/');
    });

});


module.exports = router;
