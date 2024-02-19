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