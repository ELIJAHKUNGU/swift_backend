const { doUploadKYCElements, doVerifyAccount } = require("../helperfunctions/customerHelpers")

exports.uploadKYCElements = async (req, res) => {
    await doUploadKYCElements(req, res);
    
}

exports.verifyAccount = async (req, res) => {
    await doVerifyAccount(req, res);
    
}