const express = require('express');
const router = express.Router();
const path = require('path');
const shopController = require('../controllers/shop');


router.get('/products', shopController.getProducts);
router.get('/products/:productID', shopController.getProduct);
router.get('/', shopController.getIndex);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-remove-item', shopController.postCartRemoveProduct);

router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

module.exports = router;