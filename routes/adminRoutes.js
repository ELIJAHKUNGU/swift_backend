const express = require('express');
const { userAuth } = require('../middleware/auth');
const { checkIfAdmin } = require('../middleware/checkIfAdmin');
const { approveRejectOrders } = require('../controllers/adminHelpers');


const adminRoutes = express.Router()
adminRoutes.post('/api/v1/swiftBuy/process_order',userAuth,checkIfAdmin,  approveRejectOrders)

module.exports = adminRoutes