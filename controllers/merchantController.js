const { doCreateMerchant, doGetMerchant, doAddMerchant } = require("../helperfunctions/merchatHelpers");

exports.createMerchant = async (req, res) => {
    await doAddMerchant(req, res);
}


exports.getMerchants = async (req, res) => {
    await doGetMerchant(req, res);
}