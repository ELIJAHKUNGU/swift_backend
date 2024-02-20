const { doCreateProduct } = require("../helperfunctions/productHelpers");

exports.createProduct = async (req, res) => {
    await doCreateProduct(req, res);
}