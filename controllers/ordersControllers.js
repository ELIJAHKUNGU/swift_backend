const { doCreateOrder, doGetOrders } = require("../helperfunctions/ordersHelpers");

exports.createOrder = async (req, res) => {
    await doCreateOrder(req, res);
}

exports.getOrders = async (req, res) => {
    await doGetOrders(req, res);
}