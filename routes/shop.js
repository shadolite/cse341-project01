const express = require('express');
const router = express.Router();
const path = require('path');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

router.get('/products', shopController.getProducts);
router.get('/products/:productID', shopController.getProduct);
router.get('/', shopController.getIndex);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;