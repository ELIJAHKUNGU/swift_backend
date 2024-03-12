const adminsModel = require("../models/adminModel");
const ordersModel = require("../models/orders");

exports.generateAdminNumber = async () => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}

exports.getAdminSequence = async () => {
    let newSequence = await adminsModel.find().sort({ adminSequence: -1 }).limit(1);
    if (newSequence.length === 0) {
        return 1;
    } else {
        return newSequence[0].adminSequence + 1;
    }
}
exports.doCreateAdmin = async (data, req, res) => {
    const { userEmail, firstName, lastName, userPhone, role, address, city, state, zipCode, country, defaultCurrency, userId } = data;
    let newAdminNumber = await this.generateAdminNumber();
    let newAdminSequence = await this.getAdminSequence();
    let adminData = { userEmail: userEmail, firstName: firstName, lastName: lastName, userPhone: userPhone, role: role, adminNumber: newAdminNumber, adminSequence: newAdminSequence, address: address, city: city, state: state, zipCode: zipCode, country: country, defaultCurrency: defaultCurrency, userId: userId }
    let newAdmin = new adminsModel(adminData);
    return newAdmin.save()
        .then(result => {
            return res.status(200).json({ message: 'Admin created successfully', result: result });

        })
        .catch(err => {
            return err;
        });


}

exports.doGetAdminByUserId = async (userId) => {

    return adminsModel.find({ userId: userId })
        .then(result => {
            return result[0];
        })
        .catch(err => {
            return err;
        });
}




exports.doApproveRejectOrders = async (data, req, res) => {
    const { orderNumber, orderStatus } = data;
    let order = await ordersModel.findOne({ orderNumber: orderNumber });
    if (!order) {
        return res.status(400).json({ message: 'Invalid order number' });
    }
    if (order?.orderStatus === "approved" && order?.orderStatus === "rejected") {
        return res.status(400).json({status :"failed", message :`Order is  already ${order?.orderStatus}`});
    }
    let updateData = { orderStatus: orderStatus,  };
    let updateOrder = await ordersModel.findOneAndUpdate({ orderNumber: orderNumber }, { orderStatus: orderStatus }, { new: true });
    // create transcations
    return res.status(200).json({ message: 'Order updated successfully', result: updateOrder });
}