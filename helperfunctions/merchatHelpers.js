const userModel = require("../models/user");
const merchantModel = require("../models/merchants");
const bcrypt = require('bcrypt');
const { doCreateBusiness } = require("./businessHelpers");
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb
const Category = require("../models/categoryModel");

exports.doAddMerchant = async (req, res) => {
    const { firstName, secondName, userEmail, userPhone, password , categoryIds, businessName, businessEmail, businessPhone, businessAddress} = req.body;
    try {
        let userPhoneExist = await userModel.findOne({ phoneNumber: userPhone });
        console.log(userPhoneExist, "userPhoneExist");
        if (userPhoneExist) return res.status(400).json({ error: `User with phonenumber  ${userPhone} already exists ...` });
        let userEmailExist = await userModel.findOne({ userEmail });
        if (userEmailExist) return res.status(400).json({ error: `User with email ${userEmail} already exists ...` });
        bcrypt.hash(password, 0, (err, pinHashed) => {
            if (err) {
                console.log(err);
            }
            let  user = new userModel({ firstName: firstName, lastName: secondName, userEmail: userEmail, password: pinHashed, role: "Merchant", phoneNumber: userPhone, address: "0000", city: "Lusaka", state: "Lusaka", zipCode: "0000", country: "Zambia", defaultCurrency: "ZMW", defaultBusiness: "0000" });
            console.log(user, "user=====????");
            user.save()
                .then(async result => {
                    let merchantData = {
                        merchantName: result.firstName + " " + result.lastName,
                        merchantEmail: result.userEmail,
                        merchantPhone: result.phoneNumber,
                        merchantAddress: result.address,
                        merchantCity: result.city,
                        merchantState: result.state,
                        merchantZipCode: result.zipCode,
                        paymentType: "Cash",
                        merchantType: "Individual",
                        userId: result._id,
                        categoryIds: categoryIds,
                        businessName: businessName,
                        businessEmail: businessEmail,
                        businessPhone: businessPhone,
                        businessAddress: businessAddress

                    }
                    console.log(merchantData, "merchantData");
                    await this.doCreateMerchant(merchantData, req, res);
                })
        })

    } catch (error) {
        console.log(error);
    }
}


exports.doCreateMerchant = async (merchantData, req, res) => {
    console.log(merchantData, "merchantData");
    let merchantExist = await merchantModel.findOne({ merchantEmail: merchantData.merchantEmail });
    if (merchantExist) {
        return res.status(409).json({ message: 'Merchant already exists' });
    }
    let merchantNumber = await this.generateMerchantNumber();
    let merchantSequence = await this.getMerchantSequence();
    console.log(merchantData, "merchantData");
    let categoryIds = merchantData.categoryIds;
    console.log(categoryIds, "categoryIds");
    let newMerchant = new merchantModel({
        merchantName: merchantData.merchantName,
        merchantEmail: merchantData.merchantEmail,
        merchantPhone: merchantData.merchantPhone,
        merchantAddress: merchantData.merchantAddress,
        merchantCity: merchantData.merchantCity,
        merchantState: merchantData.merchantState,
        merchantZipCode: merchantData.merchantZipCode,
        paymentType: merchantData.paymentType,
        merchantType: merchantData.merchantType,
        userId: merchantData.userId,
        category: categoryIds,  
        businessName: merchantData.businessName,
        businessEmail: merchantData.businessEmail,
        businessPhone: merchantData.businessPhone,
        businessAddress: merchantData.businessAddress,
        merchantNumber: merchantNumber,
        merchantSequence: merchantSequence
    });
    console.log(newMerchant, "newMerchant");
    return newMerchant.save()
        .then(async result => {
            await doCreateBusiness(result.businessName,result.businessEmail, result.businessPhone, result.businessAddress, result.businessCity, result.merchantState, result.merchantZipCode, result.merchantCountry, "Retail",  result.userId, result.category, result._id, req, res);
            return res.status(200).json({ message: 'Merchant created successfully', merchantName: result.merchantName, merchantEmail: result.merchantEmail, merchantPhone: result.merchantPhone, merchantAddress: result.merchantAddress, merchantCity: result.merchantCity, merchantState: result.merchantState, merchantZipCode: result.merchantZipCode, paymentType: result.paymentType, merchantType: result.merchantType, userId: result.userId, category: result.category, businessName: result.businessName, businessEmail: result.businessEmail, businessPhone: result.businessPhone, businessAddress: result.businessAddress, merchantNumber: result.merchantNumber, merchantSequence: result.merchantSequence });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        });
}

exports.doGetMerchantByUserId = async (userId) => {
    return merchantModel.find({ userId: userId })
        .then(result => {
            return result;
        })
        .catch(err => {
            return err;
        });
}


exports.generateMerchantNumber = async () => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}


exports.getMerchantSequence = async () => {
    let newSequence = await merchantModel.find().sort({ merchantSequence: -1 }).limit(1);
    if (newSequence.length === 0) {
        return 1;
    } else {
        return newSequence[0].merchantSequence + 1;
    }
}