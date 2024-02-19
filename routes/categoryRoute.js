const express = require('express')
const { createCategory } = require('../controllers/categoryController')
const categoryRoutes = express.Router()

categoryRoutes.post('/api/v1/swiftBuy/category/create', createCategory)


module.exports = categoryRoutes