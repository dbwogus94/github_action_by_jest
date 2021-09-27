const productController = require('../controllers/products');
const express = require('express');
const router = express.Router();

// GET /products
router.get('/', productController.getProducts);
// POST /products
router.post('/', productController.createProduct);

module.exports = router;
