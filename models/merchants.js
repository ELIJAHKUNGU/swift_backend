const mongoose = require("mongoose");
const  categorySchema = new mongoose.Schema({
    categoryName:{type:String, unique:true},
    categoryDescription:{type:String},
    categoryStatus:{type:String},
    categoryId:{type:String},
   
}, {
    timestamps: true
});
const merchantsSchema = new mongoose.Schema({
    userEmail:{type:String, unique:true},
    firstName:{type:String},
    lastName:{type:String},
    userName:{type:String},
    role:{type:String},
    phoneNumber:{type:String, unique:true},
    merchantNumber:{type:String},
    address:{type:String},
    city:{type:String},
    state:{type:String},
    zipCode:{type:String},
    country:{type:String, default:"Zambia"},
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'user'},
    defaultCurrency:{type:String},
    categorySchema:[categorySchema],



}, {
    timestamps: true
});

const Merchants = mongoose.model('merchants' , merchantsSchema);
module.exports = Merchants;