const express = require('express');
const { createProduct, getProducts, getProductById } = require('../controllers/productController');
const { userAuth } = require('../middleware/auth');
const productsRouter = express.Router();
productsRouter.post('/api/v1/swiftbuy/create/product',userAuth, createProduct);
productsRouter.get('/api/v1/swiftbuy/get/products',userAuth, getProducts);
productsRouter.get('/api/v1/swiftbuy/get/product/:productId',userAuth, getProductById);


module.exports = productsRouter;