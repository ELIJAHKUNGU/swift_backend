const mongoose = require('mongoose');
const businessSchema = new mongoose.Schema({
    businessName:{type:String},
    businessEmail:{type:String},
    businessPhone:{type:String},
    businessAddress:{type:String},
    businessCity:{type:String},
    businessState:{type:String},
    businessZipCode:{type:String},
    businessCountry:{type:String, default:"Zambia"},
    businessType:{type:String},
    businessNumber:{type:String},
    businessSequence:{type:Number, unique:true},
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'user'},
    category:{type:Array, ref: 'category'},
    merchantId:{type:mongoose.Schema.Types.ObjectId, ref: 'merchants'},
}, {
    timestamps: true
});



const Business = mongoose.model('business' , businessSchema);
module.exports = Business;