const customer = require("../models/customers");

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
        userId:userId
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
            return result;
        })
        .catch(err => {
            return err;
        });
}