const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customerName:{type:String},
    customerEmail:{type:String},
    customerPhone:{type:String},
    customerAddress:{type:String},
    customerCity:{type:String},
    customerState:{type:String},
    customerZipCode:{type:String},
    paymentType:{type:String},
    customerType:{type:String},
    customerNumber:{type:String},
    customerSequence : {type : Number, unique: true},
}, {
    timestamps: true
});

const customer = mongoose.model('customer' , customerSchema);
module.exports = customer;