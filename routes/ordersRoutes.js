const express = require('express');
const { userAuth } = require('../middleware/auth');
const ordersRoutes = express.Router();

ordersRoutes.post('/api/v1/swiftbuy/create/order', userAuth, createOrder);