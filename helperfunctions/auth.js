const userModel = require('../models/user')
const bcrypt = require('bcrypt');
const verificationOtpCode = require('../models/verificationOtpCode');
const HandleResponse = require("../helperfunctions/responseHelpers");
const { doSendOtpCode } = require('./sendNotification');
const { doCreateCustomer } = require('./customerHelpers');
const { doCreateAdmin } = require('./adminHelpers');
const HandleResponseInstance = new HandleResponse();

exports.doCreateUser = async (firstName, secondName, userEmail, userPhone, password, type, req, res) => {
    console.log(firstName, secondName, userEmail, userPhone, password, type, "doCreateUser");
   
   
    try {
        let userPhoneExist = await userModel.findOne({ phoneNumber: userPhone});
        console.log(userPhoneExist, "userPhoneExist");
        if (userPhoneExist) return res.status(400).json({ error: `User with phonenumber  ${userPhone} already exists ...` });
        let userEmailExist = await userModel.findOne({ userEmail });
        if (userEmailExist) return res.status(400).json({ error: `User with email ${userEmail} already exists ...` });
        bcrypt.hash(password, 0, (err, pinHashed) => {
            if (err) {
                console.log(err);
            }
            let user 
            if(type === "merchant"){
                return res.status(400).json({ message: "Invalid user type" });
                    // user = new userModel({ firstName: firstName, lastName: secondName, userEmail: userEmail, password: pinHashed, role: "Merchant", phoneNumber: userPhone, address: "0000", city: "Lusaka", state: "Lusaka", zipCode: "0000", country: "Zambia", defaultCurrency: "ZMW", defaultBusiness: "0000" });
            }else if(type === "customer"){
                 user = new userModel({ firstName: firstName, lastName: secondName, userEmail: userEmail, password: pinHashed, role: "Customer", phoneNumber: userPhone, address: "0000", city: "Lusaka", state: "Lusaka", zipCode: "0000", country: "Zambia", defaultCurrency: "ZMW", defaultBusiness: "0000" });
            }else if(type === "admin"){
                return res.status(400).json({ message: "Invalid user type" });
                // user = new userModel({ firstName: firstName, lastName: secondName, userEmail: userEmail, password: pinHashed, role: "Admin", phoneNumber: userPhone, address: "0000", city: "Lusaka", state: "Lusaka", zipCode: "0000", country: "Zambia", defaultCurrency: "ZMW", defaultBusiness: "0000" });
            }

            console.log(user, "user");
            user.save()
                .then(async result => {
                    //  res.status(200).json({ message: 'User created successfully', result: result });
                    
                     if(type === "customer"){
                        let customerData = {
                            customerName: result.firstName + " " + result.lastName,
                            customerEmail: result.userEmail,
                            customerPhone: result.userPhone,
                            customerAddress: result.address,
                            customerCity: result.city,
                            customerState: result.state,
                            customerZipCode: result.zipCode,
                            paymentType: "Cash",
                            customerType: "Individual",
                            userId: result._id
                        }
                        await doCreateCustomer(customerData, req, res);
                       return  res.status(200).json({ message: 'Customer created successfully', firstName: result.firstName, lastName: result.lastName, userEmail: result.userEmail, userPhone: result.userPhone});
    
                    }
                })
                .catch(err => { res.status(500).json({ error: err }); });
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }

};


exports.sendVerificationCode = async (req, res) => {
    const { userEmail, userName } = req.body;
    const emptyFields = [];
    if (!userEmail) {
        emptyFields.push('userEmail');

    }
    if (!userName) {
        emptyFields.push('userName');
    }
    //       return HandleResponseInstance.badRequestResponse(res, "Route Name is required");

    if (emptyFields.length > 0) return HandleResponseInstance.badRequestResponse(res, `The following fields are required: ${emptyFields.join(', ')}`);

    const otpCode = await this.generateOTP();
    const saveResult = await this.saveOtpCode(userEmail, otpCode);


    try {
        await doSendOtpCode(userEmail, otpCode, userName);
        return res.status(200).json({ message: 'OTP Code sent successfully' });

    } catch (error) {
        return HandleResponseInstance.serverError(res, error.message);
    }
};


exports.generateOTP = async (req, res, next) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}

exports.saveOtpCode = async (userEmail, otpCode) => {
    const otpDetails = await verificationOtpCode.findOne({ userEmail: userEmail });
    if (otpDetails) {
        await verificationOtpCode.deleteMany({ userEmail: userEmail });
    }
    const otpCodeStatus = "Pending";
    const expiryTime = Date.now() + 600000;
    const otpCodeDetails = new verificationOtpCode({ userEmail: userEmail, otpCode: otpCode, otpCodeStatus: otpCodeStatus, expiryTime: expiryTime });
    await otpCodeDetails.save();


}


exports.verifyOtpCode = async (req, res) => {
    const { userEmail, otpCode } = req.body;
    if (!userEmail || !otpCode) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        const otpDetails = await verificationOtpCode.findOne({ userEmail: userEmail });
        if (!otpDetails) {
            return res.status(400).json({ message: 'Invalid OTP Code' });
        }
        if (otpDetails.otpCodeStatus === "Verified") {
            return res.status(400).json({ message: 'OTP Code already verified' });
        }
        if (otpDetails.otpCode !== otpCode) {
            return res.status(400).json({ message: 'Invalid OTP Code' });
        }
        if (otpDetails.expiryTime < Date.now()) {
            return res.status(400).json({ message: 'OTP Code expired' });
        }
        await verificationOtpCode.updateOne({ userEmail: userEmail }, { otpCodeStatus: "Verified" });
        res.status(200).json({ message: 'OTP Code verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}