const { doCreateProduct, doGetProduct } = require("../helperfunctions/productHelpers");

exports.createProduct = async (req, res) => {
    await doCreateProduct(req, res);
}

exports.getProducts = async (req, res) => {
    await doGetProduct(req, res);
}