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
    customerName:{type:String},
    customerEmail:{type:String},
    customerPhone:{type:String},
    customerAddress:{type:String},
    customerCity:{type:String},
    customerState:{type:String},
    customerNumber:{type:String},
    userId:{type:String},
    customerId:{type:String},
    customerZipCode:{type:String},
    paymentType:{type:String},
    invoiceNumbers:[invoiceNumbersSchema],
    orderStatus:{type:String, default: "pending"},
    orderDate:{type:String, default: Date.now},
    orderAmount:{type:String},
    orderTax:{type:String, default: "0"},
    orderShippingCost:{type:String, default: "0"},
    orderShippingWeight:{type:String, default: "0"},
    orderDiscount:{type:String, default: "0"},
    orderNote:{type:String, default: "Customer order note"},
    orderCurrency:{type:String, default: "ZMW"},
    orderPaymentStatus:{type:String, default: "Unpaid"},
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

const orders = mongoose.model('orders' , ordersSchema);
module.exports = orders;