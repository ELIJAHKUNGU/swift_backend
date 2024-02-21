const { doCreateProduct, doGetProduct, doGetProductById } = require("../helperfunctions/productHelpers");

exports.createProduct = async (req, res) => {
    await doCreateProduct(req, res);
}

exports.getProducts = async (req, res) => {
    await doGetProduct(req, res);
}

exports.getProductById = async (req, res) => {
   await doGetProductById(req, res);
}