const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            title: 'Shop',
            path: '/shop',
            products: products,
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/productList', {
            title: 'Shop',
            path: '/shop'
        });
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        title: 'Your Cart',
        path: '/cart'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout'
    });
};