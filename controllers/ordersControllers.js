const { doCreateOrder } = require("../helperfunctions/ordersHelpers");

exports.createOrder = async (req, res) => {
    await doCreateOrder(req, res);
}