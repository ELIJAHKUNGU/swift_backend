// productName:{type:String},
// prouctImage: [productImageSchema],
// productDescription:{type:String},
// productBrand:{type:String},
// merchantId:{type:String},
// merchantNumber:{type:String},
// productCategory:{type:String},
// ratings:{type:String},
// productPrice:{type:String},
// productStatus:{type:String, default:"inactive"},
// productQuantity:{type:String},
// productDiscount:{type:String},
// productTax:{type:String},
// productShippingCost:{type:String},
// productShippingWeight:{type:String},
// productFeatures:[productFeaturesSchema],
// productTags:{type:String},
// productSequence : {type : Number, unique: true},
// productNumber:{type:String},
// categoryId:{type:mongoose.Schema.Types.ObjectId, ref: 'category'},

const Business = require("../models/businessModel");
const Merchants = require("../models/merchants");
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb


exports.doCreateProduct = async (req, res) => {
    console.log(req.id, "req.id" );
    let merchantId 
    let businessNumber
    let merchantNumber
    let role = req.role;
    if(role === "admin"){
        console.log("Admin can create product");
        let merchantId = req.body.merchantId
        if(!merchantId){
            return res.status(400).json({ message: "Merchant Id is required" });
        }
        let merchantDeatils = await Merchants.findOne({ _id:ObjectId(merchantId) });
        if(!merchantDeatils){
            return res.status(400).json({ message: "Merchant does not exist" });
        }
        let businessDetails = await Business.findOne({merchantId:merchantId});
        if(!businessDetails){
            return res.status(400).json({ message: "Business does not exist" });
        }
        businessNumber = businessDetails.businessNumber
        merchantNumber = merchantDeatils.merchantNumber


    }else if(role === "merchant"){

    }else{
        return res.status(400).json({ message: "You are not authorized to create product" });
    }

    const {productName, productImage, productDescription, productBrand, productCategory, ratings, productPrice, productQuantity, productDiscount, productTax, productShippingCost, productShippingWeight, productFeatures, productTags,} = req.body

    let emptyFields = []
    if(!productName){
        emptyFields.push('productName');
    }
    if(!productDescription){
        emptyFields.push('productDescription');
    }
    if(!productBrand){
        emptyFields.push('productBrand');
    }
    if(!productCategory){
        emptyFields.push('productCategory');
    }
    if(!productPrice){
        emptyFields.push('productPrice');
    }
    if(!productQuantity){
        emptyFields.push('productQuantity');
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ message: `The following fields are required: ${emptyFields.join(', ')}` });
    }
    let data = {
        productName:productName,
        productImage:productImage,
        productDescription:productDescription,
        productBrand:productBrand,
        merchantId:merchantId,
        merchantNumber:merchantNumber,
        businessNumber:businessNumber,
        productCategory:productCategory,
        ratings:ratings,
        productPrice:productPrice,
        productQuantity:productQuantity,
        productDiscount:productDiscount,
        productTax:productTax,
        productShippingCost:productShippingCost,
        productShippingWeight:productShippingWeight,
        productFeatures:productFeatures,
        productTags:productTags
    }
   
}


exports.doCreateProduct = async (data, req, res) => {
}