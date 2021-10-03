const Product = require('../models/product');
const uuid = require('uuid');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            products: products,
            title: 'Admin Products',
            path: '/admin/products'
        })
    })
}

exports.getAddProduct = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/editProduct', {
            title: 'Add a Product',
            path: '/admin/add-product',
            products: products,
            editing: false
        });
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(
        uuid.v1(),
        req.body.title,
        req.body.description,
        req.body.rating,
        req.body.price
    );

    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/editProduct', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            title: 'Edit Product',
            editing: editMode,
            product: product
        });
    });
}

exports.postEditProduct = (req, res, next) => {
  const updatedProduct = new Product(
    req.body.id,
    req.body.title,
    req.body.description,
    req.body.rating,
    req.body.price
  );

  updatedProduct.save();

  res.redirect('/admin/products');
};

exports.postRemoveProduct = (req, res, next) => {
    Product.remove(req.body.id);

    res.redirect('/admin/products');
};