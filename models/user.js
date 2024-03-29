const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    userEmail:{type:String, unique:true},
    password:{type:String},
    firstName:{type:String},
    lastName:{type:String},
    role:{type:String},
    phoneNumber:{type:String, unique:true},
    address:{type:String},
    city:{type:String},
    state:{type:String},
    zipCode:{type:String},
    country:{type:String, default:"Zambia"},
    defaultCurrency:{type:String},
    defaultBusiness:{type:String},
    oneTimePassword:{type:String},
    oneTimePasswordStatus:{type:String, default:"Not used"},
}, {
    timestamps: true
});

const User = mongoose.model('User' , UserSchema);
module.exports = User;