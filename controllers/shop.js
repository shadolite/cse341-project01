const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            title: 'Shop',
            path: '/',
            products: products,
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/products', {
            title: 'All Products',
            path: '/products',
            products: products
        });
    });
};

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productID, product => {
        res.render('shop/productDetail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];

            for (product of products) {
                const cartProductData = cart.products.find(
                    prod => prod.id === product.id
                );

                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }

            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const productID = req.body.productID;

    Product.findById(productID, product => {
        Cart.addProduct(productID, product.price);
    });

    res.redirect('/cart');
};

exports.postCartRemoveProduct = (req, res, next) => {
  const productID = req.body.productID;

  Product.findById(productID, product => {
    Cart.removeProduct(productID, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout'
    });
};