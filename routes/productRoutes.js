const express = require('express');
const { createProduct } = require('../controllers/productController');
const { userAuth } = require('../middleware/auth');
const productsRouter = express.Router();
productsRouter.post('/api/v1/swiftbuy/create/product',userAuth, createProduct);


module.exports = productsRouter;