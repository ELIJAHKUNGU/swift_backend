const { doCreateCategory, doGetCategories, doGetCategoryMerchantsAdsProducts } = require("../helperfunctions/categoryHelpers");

exports.createCategory = async (req, res) => {
    const { categoryName, categoryDescription, categoryImage } = req.body;
    let emptyFields = [];
    if (!categoryName) {
        emptyFields.push('categoryName');
    }
    if (!categoryDescription) {
        emptyFields.push('categoryDescription');
    }

    if (emptyFields.length > 0) return res.status(400).json({ message: `The following fields are required: ${emptyFields.join(', ')}` });
    await doCreateCategory(categoryName, categoryDescription, categoryImage, req, res);
}

exports.getCategories = async (req, res) => {
    await doGetCategories(req, res);
}


exports.getCategoryMerchantsAdsProducts = async (req, res) => {
    await doGetCategoryMerchantsAdsProducts(req, res);
}