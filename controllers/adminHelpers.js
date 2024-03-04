const { doApproveRejectOrders } = require("../helperfunctions/adminHelpers");

exports.approveRejectOrders = async (req, res) => {
    const { orderNumber, orderStatus } = req.body;
    let data = { orderNumber, orderStatus };
    if (orderStatus === "approved" && orderStatus === "rejected") {
        return res.status(400).json({ message: 'Invalid order status' });
    }

    if (!orderNumber) {
        return res.status(400).json({ message: 'Invalid order number' });
    }

    await doApproveRejectOrders(data, req, res);

}