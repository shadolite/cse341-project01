const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/products', {
                title: 'All Products',
                path: '/products',
                products: products
            });
        })
        .catch(error => console.log(error));
};

exports.getProduct = (req, res, next) => {
    const id = req.params.productID;
    Product.findByID(req.params.productID)
        .then(product => {
            res.render('shop/productDetail', {
                product: product,
                title: product.title,
                path: '/products'
            });
        })
        .catch(error => console.log(error));
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                title: 'Shop',
                path: '/',
                products: products,
            });
        })
        .catch(error => console.log(error));
};


exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        path: '/cart',
        title: 'Your Cart',
        cart: req.user.cart
    });
};

exports.postCart = (req, res, next) => {
    Product.findByID(req.body.productID)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    req.user
        .deleteItemFromCart(req.body.productID)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => console.log(error));
};

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(error => console.log(error));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(error => console.log(error));
};