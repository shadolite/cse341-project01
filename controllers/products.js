
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('pages/shop', {
            title: 'Shop',
            path: '/shop',
            products: products,
        });
    });

};

exports.getAddProduct = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('pages/addProduct', {
            title: 'Add a Product',
            path: '/admin/add-product',
            products: products
        });
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(
        req.body.title,
        req.body.description,
        req.body.rating,
        req.body.price
    );

    product.save();
    res.redirect('/shop');
};

exports.getRemoveProduct = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('pages/removeProduct', {
            title: 'Remove a Product',
            path: '/admin/remove-product',
            products: products
        });
    });
};

exports.postRemoveProduct = (req, res, next) => {
    var titleIndex = req.body.index;

    if (titleIndex > -1) {
        Product.remove(titleIndex);
    }

    res.redirect('/shop');
};