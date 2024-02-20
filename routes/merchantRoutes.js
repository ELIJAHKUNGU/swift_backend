const express = require('express');
const { getMerchants, createMerchant } = require('../controllers/merchantController');
const { userAuth } = require('../middleware/auth');
const merchantRoutes = express.Router()

merchantRoutes.post('/api/v1/swiftBuy/add_merchant',createMerchant)
merchantRoutes.get('/api/v1/swiftBuy/get_merchant',userAuth,getMerchants)
module.exports = merchantRoutes