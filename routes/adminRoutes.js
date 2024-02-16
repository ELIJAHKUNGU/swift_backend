const express = require('express');
const { userAuth } = require('../middleware/auth');


const adminRoutes = express.Router()
adminRoutes.post('/api/v1/swiftBuy/add_merchant',userAuth, doAddMerchant)