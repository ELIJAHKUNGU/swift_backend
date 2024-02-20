const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
    productImageUrl:{type:String},
    productImageDescription:{type:String},
    productImageStatus:{type:String, default:"active"},
   
}, {
    timestamps: true
});
const productFeaturesSchema = new mongoose.Schema({
    productFeatures:{type:String},
    productFeaturesDescription:{type:String},
    productFeaturesStatus:{type:String, default:"active"},
}, {
    timestamps: true
});
const productSchema = new mongoose.Schema({
    productName:{type:String},
    prouctImage: [productImageSchema],
    productDescription:{type:String},
    productBrand:{type:String},
    merchantId:{type:String},
    merchantNumber:{type:String},
    businessNumber:{type:String},
    productCategory:{type:String},
    ratings:{type:String},
    productPrice:{type:String},
    productStatus:{type:String, default:"inactive"},
    productQuantity:{type:String},
    productDiscount:{type:String, default:"0"},
    productTax:{type:String},
    productShippingCost:{type:String},
    productShippingWeight:{type:String},
    productFeatures:[productFeaturesSchema],
    productTags:{type:String},
    productSequence : {type : Number, unique: true},
    productNumber:{type:String},
}, {
    timestamps: true
});

const Products = mongoose.model('products' , productSchema);
module.exports = Products;