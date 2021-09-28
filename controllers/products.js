
const products = [];

exports.getProducts = (req, res, next) => {
    res.render('pages/products', {
        title: 'Products',
        path: '/products',
        products: products,
    });
};

exports.getAddProduct = (req, res, next) => {
    res.render('pages/addProduct', {
        title: 'Add a Product',
        path: '/products/add-product',
        products: products
    });
};

exports.postAddProduct = (req, res, next) => {
    products.push({
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating,
        price: req.body.price
    });

    res.redirect('/products');
};

exports.getRemoveProduct = (req, res, next) => {
    res.render('pages/removeProduct', {
        title: 'Remove a Product',
        path: '/products/remove-product',
        products: products
    });
};

exports.postRemoveProduct = (req, res, next) => {
    var titleIndex = req.body.index;

    if (titleIndex > -1) {
        products.splice(titleIndex, 1);
    }

    res.redirect('/products');
};