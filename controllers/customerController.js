const { doUploadKYCElements, doVerifyAccount, doGetCustomerInfo, doGetCustomers } = require("../helperfunctions/customerHelpers");
const customer = require("../models/customers");

exports.uploadKYCElements = async (req, res) => {
    await doUploadKYCElements(req, res);
    
}

exports.verifyAccount = async (req, res) => {
    await doVerifyAccount(req, res);
    
}

exports.getCustomerInfo = async (req, res) => {
    await doGetCustomerInfo(req, res);
    
}


exports.getCustomers = async (req, res) => {
    await doGetCustomers (req, res);
}