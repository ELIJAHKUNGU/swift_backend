const Business = require("../models/businessModel");

exports.generateBusinessNumber = async () => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}


exports.getBusinessSequence = async () => {
    let newSequence = await Business.find().sort({ businessSequence: -1 }).limit(1);
    if (newSequence.length === 0) {
        return 1;
    } else {
        return newSequence[0].businessSequence + 1;
    }
}

exports.doCreateBusiness = async (businessName,businessEmail, businessPhone, businessAddress, businessCity, businessState, businessZipCode, businessCountry, businessType,  userId, category, merchantId, req, res) => {
    try {
        const business = new Business({
            businessName: businessName,
            businessEmail: businessEmail,
            businessPhone: businessPhone,
            businessAddress: businessAddress,
            businessCity: businessCity,
            businessState: businessState,
            businessZipCode: businessZipCode,
            businessCountry: businessCountry,
            businessType: businessType,
            businessNumber: await this.generateBusinessNumber(),
            businessSequence: await this.getBusinessSequence(),
            userId: userId,
            category: category,
            merchantId: merchantId
        });
        return await business.save();
    } catch (error) {
        throw new Error(error);
    }
}

exports.doGetBusinessByUserId = async (userId) => {
    return Business.find({ userId: userId })
        .then(result => {
            return result;
        })
        .catch(err => {
            return err;
        });
}