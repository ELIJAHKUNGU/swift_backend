const express = require('express');
const { userAuth } = require('../middleware/auth');
const { createOrder } = require('../controllers/ordersControllers');
const ordersRoutes = express.Router();

ordersRoutes.post('/api/v1/swiftbuy/place/order', userAuth, createOrder);
ordersRoutes.get('/api/v1/swiftbuy/ger/orders', userAuth, createOrder);


module.exports = ordersRoutes;