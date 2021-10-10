const express = require('express');
const router = express.Router();
const path = require('path');
const shopController = require('../controllers/shop');

router.get('/products', shopController.getProducts);
router.get('/products/:productID', shopController.getProduct);
router.get('/', shopController.getIndex);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/create-order', shopController.postOrder);
router.get('/orders', shopController.getOrders);

module.exports = router;