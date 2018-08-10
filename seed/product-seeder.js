var Product = require('../models/product.js');

var mongoose = require('mongoose');

mongoose.connect('mongodb://shopping:shopping1@ds159776.mlab.com:59776/shopping');

var products = [
    new Product({
        title: 'HandBag',
        description: 'Multicolored Leather Bag',
        price: '6500',
        imagePath: 'https://ng.jumia.is/S1WVb4zz7zUYx27wMy9e109cp4E=/fit-in/220x220/filters:fill(white):sharpen(1,0,false):quality(100)/product/25/410541/1.jpg?7634'
    }),

    new Product({
        title: 'HandBag',
        description: 'Handbag set',
        price: '7500',
        imagePath: 'https://ng.jumia.is/oQsoV8LrLOS7KUkI5miRfqc-QdM=/fit-in/220x220/filters:fill(white):sharpen(1,0,false):quality(100)/product/34/85999/1.jpg?9868'
    }),

     new Product({
        title: 'Jewelry',
        description: 'Gold Silver Engagement Ring',
        price: '1500',
        imagePath: 'https://ng.jumia.is/3kecS_nZlHd5uaciYP888e7qFt0=/fit-in/220x220/filters:fill(white):sharpen(1,0,false):quality(100)/product/70/76256/1.jpg?4920'
    }),

      new Product({
        title: 'Face Caps',
        description: 'Ladies Floral Baseball Caps',
        price: '2000',
        imagePath: 'https://ng.jumia.is/rF3InrjOTKsRdlBwHHc-hGz4iYU=/fit-in/220x220/filters:fill(white):sharpen(1,0,false):quality(100)/product/23/87195/1.jpg?5531'    }),

       new Product({
        title: 'Purse',
        description: 'Ladies Makeup Purse',
        price: '1000',
        imagePath: 'https://ng.jumia.is/cFeRbRR8TKN3yDvoS4nlH_-iDmw=/fit-in/220x220/filters:fill(white):sharpen(1,0,false):quality(100)/product/72/049011/1.jpg?1575'
    }),

        new Product({
        title: 'Jewelry',
        description: '19 sets of earrings',
        price: '2500',
        imagePath: 'https://ng.jumia.is/sDhluZWxDBiHsVYz4e7EwlnChO4=/fit-in/220x220/filters:fill(white):sharpen(1,0,false):quality(100)/product/57/785941/1.jpg?6341'
    }),



];

var done = 0;

for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}