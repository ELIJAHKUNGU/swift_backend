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
const invoiceNumbersSchema = new mongoose.Schema({
    invoiceNumber:{type:String},
    invoiceNumberStatus:{type:String},
    invoiceNumberId:{type:String},
    invoiceNumberDate:{type:String},
    invoiceNumberAmount:{type:String},



}, {
    timestamps: true
});
const ordersSchema = new mongoose.Schema({
    orderNumber:{type:String},
    orderSequence : {type : Number, unique: true},
    products:[productsSchema],
    customerId:{type:String},
    customerName:{type:String},
    customerEmail:{type:String},
    customerPhone:{type:String},
    customerAddress:{type:String},
    customerCity:{type:String},
    customerState:{type:String},
    customerZipCode:{type:String},
    paymentType:{type:String},
    invoiceNumbers:[invoiceNumbersSchema],
    orderStatus:{type:String},
    orderDate:{type:String},
    orderAmount:{type:String},
    orderTax:{type:String},
    orderShippingCost:{type:String},
    orderShippingWeight:{type:String},
    orderDiscount:{type:String},
    orderTotal:{type:String},
    orderNote:{type:String},
    orderCurrency:{type:String},
    orderPaymentStatus:{type:String},
    orderPaymentMethod:{type:String},
    orderPaymentDate:{type:String},
    orderPaymentAmount:{type:String},
    orderPaymentTransactionId:{type:String},
    orderPaymentCurrency:{type:String},
    orderPaymentNote:{type:String},
    orderPaymentRefundAmount:{type:String},
    orderPaymentRefundTransactionId:{type:String},
    orderPaymentRefundCurrency:{type:String},
    orderPaymentRefundNote:{type:String},
    

}, {
    timestamps: true
});

const customer = mongoose.model('customer' , ordersSchema);
module.exports = customer;