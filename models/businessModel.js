const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    categoryName:{type:String, unique:true},
    categoryDescription:{type:String},
    categoryStatus:{type:String},
   status:{type:String}
   
}, {
    timestamps: true
});

const businessSchema = new mongoose.Schema({
    businessName:{type:String, unique:true},
    businessEmail:{type:String, unique:true},
    businessPhone:{type:String, unique:true},
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