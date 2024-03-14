const express = require('express');
const { uploadKYCElements, verifyAccount, getCustomerInfo } = require('../controllers/customerController');
const { checkIfAdmin } = require('../middleware/checkIfAdmin');
const { userAuth } = require('../middleware/auth');
const customerRoutes = express.Router()

customerRoutes.post('/api/v1/swiftBuy/upload_kyc',userAuth,  uploadKYCElements)
customerRoutes.post('/api/v1/swiftBuy/verify_account',userAuth,checkIfAdmin,  verifyAccount)
customerRoutes.get('/api/v1/swiftBuy/customer_info',userAuth,  getCustomerInfo)



module.exports = customerRoutes