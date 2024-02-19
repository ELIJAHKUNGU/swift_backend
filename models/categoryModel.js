const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, unique: true },
    categoryDescription: { type: String },
    categoryStatus: { type: String },
    status: { type: String, default: 'active' },
    categoryImage: { type: String }

}, {
    timestamps: true
});


const Category = mongoose.model('category', categorySchema);
module.exports = Category;