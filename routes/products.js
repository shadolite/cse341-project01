const express = require('express');
const router = express.Router();
const path = require('path');
const products = [];

router.get('/', (req, res, next) => {
  res.render('pages/products', {
    title: 'Products',
    path: '/products',
    products: products,
  });
});

router.get('/add-product', (req, res, next) => {
  res.render('pages/addProduct', {
    title: 'Add a Product',
    path: '/products/add-product',
    products: products
  });
})

router.post('/add-product', (req, res, next) => {
  products.push({
    title: req.body.title,
    description: req.body.description,
    rating: req.body.rating,
    price: req.body.price
  });
  res.redirect('/products');
});

router.get('/remove-product', (req, res, next) => {
  res.render('pages/removeProduct', {
    title: 'Remove a Product',
    path: '/products/remove-product',
    products: products
  });
})

router.post('/remove-product', (req, res, next) => {
  var titleIndex = req.body.index;

  if (titleIndex > -1) {
    products.splice(titleIndex, 1);
  }

  res.redirect('/products');
});

exports.routes = router;
exports.users = products;
