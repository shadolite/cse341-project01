const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct); router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim(),
    body('rating')
      .isNumeric(),
    body('price').isFloat()
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/edit-product/:productID', isAuth, adminController.getEditProduct);
router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim(),
      body('rating')
        .isNumeric(),
    body('price').isFloat()
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;