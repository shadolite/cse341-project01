const Product = require('../models/product');

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
        undefined,
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

    const prodID = req.params.productID;

    Product.findByID(prodID, product => {
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