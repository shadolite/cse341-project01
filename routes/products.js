const express = require('express');
const router = express.Router();
const path = require('path');
const productsController = require('../controllers/products');


router.get('/', productsController.getProducts);

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

router.get('/remove-product', productsController.getRemoveProduct);

router.post('/remove-product', productsController.postRemoveProduct);

module.exports = router;