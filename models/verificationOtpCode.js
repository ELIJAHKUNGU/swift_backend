const mongoose = require('mongoose');

const verificationOtpCodeSchema = new mongoose.Schema({
    userEmail: { type: String, unique: true },
    otpCode: { type: String },
    otpCodeStatus: { type: String },
    expiryTime: { type: Date, default: Date.now, expires: 600},  
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600

    } 

}, {
    timestamps: true
});



const verificationOtpCode = mongoose.model('verificationOtpCode', verificationOtpCodeSchema);
verificationOtpCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });
verificationOtpCodeSchema.index({userEmail:1,otpCode:1,otpCodeStatus:1,expiryTime:1}, {name: 'otpCodeIndex'})
module.exports = verificationOtpCode;