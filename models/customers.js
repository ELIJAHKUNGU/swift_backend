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
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'user'}
}, {
    timestamps: true
});

const customer = mongoose.model('customer' , customerSchema);
module.exports = customer;