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
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'user'},
    idCard: {type:Object},
    bankStatement:{type:String},
    passsPort:{type:String},
    letterEmpolyment:{type:String},
    verifyAccount:{type:Boolean, default:false},
    kycVerified:{type:Boolean, default:false},
    limit:{type:Number, default:0},
    verifyLimit:{type:Boolean, default:0},
}, {
    timestamps: true
});

const customer = mongoose.model('customer' , customerSchema);
module.exports = customer;