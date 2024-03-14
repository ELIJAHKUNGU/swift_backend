const { doUploadKYCElements, doVerifyAccount, doGetCustomerInfo } = require("../helperfunctions/customerHelpers")

exports.uploadKYCElements = async (req, res) => {
    await doUploadKYCElements(req, res);
    
}

exports.verifyAccount = async (req, res) => {
    await doVerifyAccount(req, res);
    
}

exports.getCustomerInfo = async (req, res) => {
    await doGetCustomerInfo(req, res);
    
}