const Category = require("../models/categoryModel");

exports.doCreateCategory = async (categoryName, categoryDescription,categoryImage, req, res) => {
    let categoryExist = await Category.findOne({ categoryName: categoryName });
    if (categoryExist) {
        return res.status(409).json({ message: 'Category already exists' });
    }
    let newCategory = new Category({
        categoryName: categoryName,
        categoryDescription: categoryDescription,
        categoryImage: categoryImage
    });
    return newCategory.save()
        .then(result => {
            return res.status(200).json({ message: 'Category created successfully', categoryName: result.categoryName, categoryDescription: result.categoryDescription, categoryImage: result.categoryImage });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        });
};


exports.doGetCategories = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const category = await Category.find().limit(limit).skip(startIndex);
    const count = await Category.countDocuments();
    const totalPages = Math.ceil(count / limit);
    return res.status(200).json({ category, totalPages, currentPage: page });
}