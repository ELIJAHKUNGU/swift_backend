const categoryModel = require("../models/categoryModel");



exports.doAddMerchant = async (req, res) => {
    let { merchantName, merchantEmail, merchantPhone, merchantAddress, merchantCity, merchantState, merchantZipCode, paymentType, merchantType, userId  } = req.body;


    let newMerchantNumber = await this.generateMerchantNumber();
    let newMerchantSequence = await this.getMerchantSequence();

    let categoryIds = req.body.categoryIds;
    let category = [];
    categoryIds.map(async(item) => {
        let categoryObj = await categoryModel.findOne({ _id: item.categoryId });
        let categoryData = {
            categoryName: categoryObj.categoryName,
            categoryDescription: categoryObj.categoryDescription,
            categoryStatus: categoryObj.categoryStatus,
            categoryId: categoryObj._id
        }
        category.push(categoryData);
    })

    let merchantData = {
        merchantName: merchantName,
        merchantEmail: merchantEmail,
        merchantPhone: merchantPhone,
        merchantAddress: merchantAddress,
        merchantCity: merchantCity,
        merchantState: merchantState,
        merchantZipCode: merchantZipCode,
        paymentType: paymentType,
        merchantType: merchantType,
        merchantNumber: newMerchantNumber,
        merchantSequence: newMerchantSequence,
        userId: userId,
        category:category
    }


    let newMerchant = new merchant(merchantData);
    return newMerchant.save()
        .then(result => {
            return result;
        })
        .catch(err => {
            return err;
        });
};


exports.doGetMerchantByUserId = async (userId) => {
    return merchant.find({ userId: userId })
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
    let newSequence = await merchant.find().sort({ merchantSequence: -1 }).limit(1);
    if (newSequence.length === 0) {
        return 1;
    } else {
        return newSequence[0].merchantSequence + 1;
    }
}