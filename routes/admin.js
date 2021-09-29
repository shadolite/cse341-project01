const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/admin');

router.get('/products');

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);

router.get('/remove-product', adminController.getRemoveProduct);
router.post('/remove-product', adminController.postRemoveProduct);

module.exports = router;