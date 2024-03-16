const customer = require("../models/customers");
const { ObjectId } = require('mongoose').Types;

exports.generateCustomerNumber = async () => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}

exports.getCustomerSequence = async () => {
    let newSequence = await customer.find().sort({ customerSequence: -1 }).limit(1);
    if (newSequence.length === 0) {
        return 1;
    } else {
        return newSequence[0].customerSequence + 1;
    }
}
exports.doCreateCustomer = async (data, req, res) => {
    const { customerName, customerEmail, customerPhone, customerAddress, customerCity, customerState, customerZipCode, paymentType, customerType, userId } = data;
    let newCustomerNumber = await this.generateCustomerNumber();
    let newCustomerSequence = await this.getCustomerSequence();
    let customerData = {
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        customerCity: customerCity,
        customerState: customerState,
        customerZipCode: customerZipCode,
        paymentType: paymentType,
        customerType: customerType,
        customerNumber: newCustomerNumber,
        customerSequence: newCustomerSequence,
        userId: userId
    }
    let newCustomer = new customer(customerData);
    return newCustomer.save()
        .then(result => {
            return result;
        })
        .catch(err => {
            return err;
        });
}



exports.doGetCustomerByUserId = async (userId) => {
    return customer.find({ userId: userId })
        .then(result => {
            return result[0];
        })
        .catch(err => {
            return err;
        });
}

exports.doGetCustomerByCustomerId = async (customerId) => {
    return customer.findOne({ _id: new ObjectId(customerId) })
        .then(result => {
            return result;
        })
        .catch(err => {
            return err;
        });
}


exports.doUploadKYCElements = async (req, res) => {
    let customerId = req.id?.customerId;


    if (!customerId) {
        return res.status(400).json({ status: "Failed", message: 'Kindly provide the customer Id' });
    }
    const { idCard, bankStatement, passsPort, letterEmpolyment } = req.body;
    let emptyFields = [];
    if (!idCard) {
        // idCard: [
        //     {
        //         front: 'idCard is required'
        //     },
        //     {
        //         back: 'idCard is required'
        //     }
        // ]
        emptyFields.push('idCard');
    }
    if (!bankStatement) {
        emptyFields.push('bankStatement');
    }
    if (!passsPort) {
        emptyFields.push('passsPort');
    }
    if (!letterEmpolyment) {
        emptyFields.push('letterEmpolyment');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ message: `Kindly provide the following fields ${emptyFields.join(', ')}` });
    }
    let customerData = await customer.findOne({ _id: customerId });
    if (!customerData) {
        return res.status(400).json({ status: "Failed", message: `customer with id ${customerId} not found` });
    }
    if (idCard.length < 0) {
        return res.status(400).json({ status: "Failed", message: 'Kindly provide the idCard' });
    }

    customerData.idCard = idCard;
    customerData.bankStatement = bankStatement;
    customerData.passsPort = passsPort;
    customerData.letterEmpolyment = letterEmpolyment;
    return customerData.save()
        .then(result => {
            return res.status(200).json({ status: "Success", message: 'KYC elements uploaded successfully', result: result });
        })
        .catch(err => {
            console.error("Error uploading KYC elements:", err);
            return res.status(400).json({ status: "Failed", message: 'Error uploading KYC elements', err: err });
        });





}

exports.doVerifyAccount = async (req, res) => {
    const { verifyAccount, limit, customerId } = req.body;

    if (!customerId) {
        return res.status(400).json({ status: "Failed", message: 'Kindly provide the customer Id' });
    }
    let customerData = await customer.findOne({ _id: new ObjectId(customerId) })
    if (!customerData) {
        return res.status(400).json({ status: "Failed", message: `customer with id ${customerId} not found` });
    }
    if (verifyAccount) {
        customerData.verifyAccount = verifyAccount;
    }
    if (limit) {
        customerData.limit = limit;
        customerData.verifyLimit = true;
    }
    return customerData.save()
        .then(result => {
            return res.status(200).json({ status: "Success", message: 'Account verified successfully', result: result });
        })
        .catch(err => {
            console.error("Error verifying account:", err);
            return res.status(400).json({ status: "Failed", message: 'Error verifying account', err: err });
        });

}

exports.doGetCustomerInfo = (req, res) => {
    const { customerId } = req.query;

    if (!customerId) {
        return res.status(400).json({ status: "Failed", message: 'Kindly provide the customer Id' });
    }
    return customer.findOne({ _id: new ObjectId(customerId) })
        .then(result => {
            return res.status(200).json({ status: "Success", message: 'Customer info retrieved successfully', result: result });
        })
        .catch(err => {
            console.error("Error retrieving customer info:", err);
            return res.status(400).json({ status: "Failed", message: 'Error retrieving customer info', err: err });
        });
}

exports.doGetCustomers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";


    const customers = await customer.aggregate([
        {
            $match: {
                $or: [
                    { customerName: { $regex: search, $options: 'i' } },
                    { customerEmail: { $regex: search, $options: 'i' } },
                    { customerPhone: { $regex: search, $options: 'i' } },
                    { customerNumber: { $regex: search, $options: 'i' } },
                ]
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {$project : {
            customerName: 1,
            customerEmail: 1,
            customerPhone: 1,
            customerNumber: 1,
            customerType: 1,
            customerAddress: 1,
            customerCity: 1,
            customerState: 1,
            customerZipCode: 1,
            paymentType: 1,
            verifyAccount: 1,
            limit: 1,
            verifyLimit: 1,
            idCard: 1,
            bankStatement: 1,
            passsPort: 1,
            letterEmpolyment: 1,
            createdAt: 1,
            updatedAt: 1

        }}
    ]);

    return res.status(200).json({ status: "Success", message: 'Customers retrieved successfully', data: customers });

}