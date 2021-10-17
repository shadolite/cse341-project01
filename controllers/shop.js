const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
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
  Product.findById(req.params.productID)
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
  Product.find()
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
  req.user
    .populate('cart.items.product')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        title: 'Your Cart',
        cart: products
      });
    })
    .catch(error => console.log(error))
};

exports.postCart = (req, res, next) => {
  Product.findByID(req.body.productID)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(`Added item to cart`);
      res.redirect('/cart');
    })
    .catch(error => console.log(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
  req.user
    .deleteFromCart(req.body.productID)
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
        title: 'Your Orders',
        orders: orders
      });
    })
    .catch(error => console.log(error));
};