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
    .catch(e => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    })
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
    .catch(e => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(e => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(e => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  Product.findById(req.body.productID)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(`Added item to cart`);
      res.redirect('/cart');
    })
    .catch(e => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  req.user
    .deleteFromCart(req.body.productID)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(e => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products: products
    });
    return order.save();
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders');
  })
  .catch(e => {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        title: 'Your Orders',
        orders: orders
      });
    })
    .catch(e => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};