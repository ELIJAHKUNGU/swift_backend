const express = require('express')
const { createCategory, getCategories } = require('../controllers/categoryController')
const categoryRoutes = express.Router()

categoryRoutes.post('/api/v1/swiftBuy/category/create', createCategory)
categoryRoutes.get('/api/v1/swiftBuy/category/all', getCategories)



module.exports = categoryRoutes