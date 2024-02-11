const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
    productName:{type:String},
    productDescription:{type:String},
    productBrand:{type:String},
    merchantId:{type:String},
    merchantNumber:{type:String},
    productCategory:{type:String},
    ratings:{type:String},
    productPrice:{type:String},
    productStatus:{type:String},
    productQuantity:{type:String},
    productDiscount:{type:String},
    productTax:{type:String},
    productShippingCost:{type:String},
    productShippingWeight:{type:String},
    productTags:{type:String},
    productNumber:{type:String},

}, {
    timestamps: true
});

const invoiceSchema = new mongoose.Schema({
    invoiceNumber:{type:String},
    invoiceNumberStatus:{type:String},
    invoiceNumberSequence : {type : Number, unique: true},
    invoiceAmount:{type:String},
    customerId:{type:String},
    customerName:{type:String},
    customerEmail:{type:String},
    customerPhone:{type:String},
    customerAddress:{type:String},
    customerCity:{type:String},
    customerState:{type:String},
    customerZipCode:{type:String},
    paymentType:{type:String},
    products:[productsSchema],
    invoiceStatus:{type:String},
    invoiceDate:{type:String},
    orderId:{type:String},
    orderNumber:{type:String},

}, {
    timestamps: true
});

const customer = mongoose.model('customer' , invoiceSchema);
module.exports = customer;