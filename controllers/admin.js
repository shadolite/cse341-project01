const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                products: products,
                title: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(error => console.log(error));
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/editProduct', {
        title: 'Add a Product',
        path: '/admin/add-product',
        editing: false
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

    product
        .save()
        .then(result => {
            console.log('Created Product');
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const productID = req.params.productID;

    Product.findByID(productID)
        .then(product => {
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
        })
        .catch(error => console.log(error));
}

exports.postEditProduct = (req, res, next) => {
    const product = new Product(
        req.body.id,
        req.body.title,
        req.body.description,
        req.body.rating,
        req.body.price
    );

    product
        .save()
        .then(result => {
            console.log('Updated Product');
            res.redirect('/admin/products');
        })
        .catch(error => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
    Product.deleteByID(req.body.id)
        .then(() => {
            console.log('Deleted Product');
            res.redirect('/admin/products');
        })
        .catch(error => console.log(error));
};