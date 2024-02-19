const { doCreateMerchant } = require("../helperfunctions/merchatHelpers");

exports.createMerchant = async (req, res) => {
    await doCreateMerchant(req, res);
}