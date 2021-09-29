const express = require('express');
const router = express.Router();
const path = require('path');
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/delete');
router.get('products/:productId');
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);

module.exports = router;