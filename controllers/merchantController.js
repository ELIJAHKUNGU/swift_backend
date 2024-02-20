const { doCreateMerchant, doGetMerchant } = require("../helperfunctions/merchatHelpers");

exports.createMerchant = async (req, res) => {
    await doCreateMerchant(req, res);
}


exports.getMerchants = async (req, res) => {
    await doGetMerchant(req, res);
}