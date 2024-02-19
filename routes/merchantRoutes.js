const express = require('express');
const { doAddMerchant } = require('../helperfunctions/merchatHelpers');
const merchantRoutes = express.Router()

merchantRoutes.post('/api/v1/swiftBuy/add_merchant',doAddMerchant)
module.exports = merchantRoutes