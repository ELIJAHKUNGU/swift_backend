const express = require('express')
const { createCategory, getCategories, getCategoryMerchantsAdsProducts } = require('../controllers/categoryController')
const categoryRoutes = express.Router()

categoryRoutes.post('/api/v1/swiftBuy/category/create', createCategory)
categoryRoutes.get('/api/v1/swiftBuy/category/all', getCategories)
categoryRoutes.get('/api/v1/swiftBuy/category/all/merchants/ads/products', getCategoryMerchantsAdsProducts)





module.exports = categoryRoutes