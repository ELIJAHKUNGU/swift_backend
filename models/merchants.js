const mongoose = require("mongoose");

const merchantsSchema = new mongoose.Schema({
    merchantName:{type:String},
    merchantEmail:{type:String},
    merchantPhone:{type:String},
    merchantAddress:{type:String},
    merchantCity:{type:String},
    merchantState:{type:String},
    merchantZipCode:{type:String},
    paymentType:{type:String, default:"Cash"},
    merchantCountry:{type:String, default:"Zambia"},
    merchantType:{type:String, default:"Individual"},
    merchantNumber:{type:String},
    merchantSequence:{type:Number, unique:true},
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'user'},
    category:{type:Array},
    businessName:{type:String},
    businessEmail:{type:String},
    businessPhone:{type:String},
    businessAddress:{type:String},




}, {
    timestamps: true
});

const Merchants = mongoose.model('merchants' , merchantsSchema);
module.exports = Merchants;