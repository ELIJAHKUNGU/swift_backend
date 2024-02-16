const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    userEmail:{type:String, unique:true},
    firstName:{type:String},
    lastName:{type:String},
    userName:{type:String},
    role:{type:String},
    phoneNumber:{type:String, unique:true},
    adminNumber:{type:String},
    adminSequence : {type : Number, unique: true},
    address:{type:String},
    city:{type:String},
    state:{type:String},
    zipCode:{type:String},
    country:{type:String, default:"Zambia"},
    defaultCurrency:{type:String},
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'user'}
   



}, {
    timestamps: true
});

const adminsModel = mongoose.model('admins' , adminSchema);
module.exports = adminsModel;