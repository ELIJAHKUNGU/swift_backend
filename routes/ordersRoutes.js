const express = require('express');
const { userAuth } = require('../middleware/auth');
const { createOrder, getOrders } = require('../controllers/ordersControllers');
const ordersRoutes = express.Router();

ordersRoutes.post('/api/v1/swiftbuy/place/order', userAuth, createOrder);
ordersRoutes.get('/api/v1/swiftbuy/get/orders', userAuth, getOrders);


module.exports = ordersRoutes;