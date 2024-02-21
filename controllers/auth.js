const router = require('express').Router();
const userModel = require('../models/user')
// const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const { doCreateUser } = require('../helperfunctions/auth');
const { doCreateCustomer, doGetCustomerByUserId } = require('../helperfunctions/customerHelpers');
const { doGetAdminByUserId } = require('../helperfunctions/adminHelpers');
const { doGetBusinessByUserId } = require('../helperfunctions/businessHelpers');
const { doGetMerchantByUserId } = require('../helperfunctions/merchatHelpers');
exports.RegisterUser = async (req, res) => {
    const { firstName, secondName, userEmail, userPhone, password } = req.body;
    let type
    if(!type === "customer"){
        type = "customer"
    }else{
        type = req.body.type
        if(type !== "admin"  && type !== "customer" && type !== "merchant"){
            return res.status(400).json({ message: "Invalid user type" });
        }
          
    }
    try {
        const createUser = await doCreateUser(firstName, secondName, userEmail, userPhone, password, type, req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


};

//login user
exports.LoginUser = async (req, res) => {
    try {
        const { userEmail, password, phoneNumber } = req.body;
        if (!userEmail && !phoneNumber) {
            return res.status(400).json({ message: "Email or Phone Number is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await userModel.findOne({ $or: [{ userEmail: userEmail }, { phoneNumber: phoneNumber }] });
        if (!user) {
            return res.status(400).json({ message: "User does not exist,Kindly register" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        let  customerDeatils = {}
        let adminDeatils = {}
        let merchantDeatils = {}
        if (user.role === "Customer") {
            customerDeatils = await doGetCustomerByUserId(user._id, req, res);
            const token = jwt.sign({id: user._id,userId:user._id,email: user.userEmail,role: user.role,phoneNumber: user.phoneNumber,firstName: user.firstName,lastName: user.lastName,address: user.address,city: user.city,state: user.state,zipCode: user.zipCode,country: user.country, customerId:customerDeatils?._id, customerNumber: customerDeatils?.customerNumber}, process.env.JWT_SECRET, { expiresIn: "10hr" });
            return res.status(200).json({status:"Success", message:"user logged in successfully", token, userId: user._id, role: user.role, email: user.email, phoneNumber: user.phoneNumber, firstName: user.firstName, lastName: user.lastName, address: user.address, city: user.city, state: user.state, zipCode: user.zipCode, country: user.country, customerId:customerDeatils?._id });
        }else if (user.role === "Admin") {
            adminDeatils = await doGetAdminByUserId(user._id, req, res);
            console.log(adminDeatils, "adminDeatils");
            const token = jwt.sign({id: user._id,userId:user._id,email: user.userEmail,role: user.role,phoneNumber: user.phoneNumber,firstName: user.firstName,lastName: user.lastName,address: user.address,city: user.city,state: user.state,zipCode: user.zipCode,country: user.country, adminId:adminDeatils?._id }, process.env.JWT_SECRET, { expiresIn: "10hr" });
            return res.status(200).json({ status:"Success", message:"user logged in successfully",token, userId: user._id, role: user.role, email: user.email, phoneNumber: user.phoneNumber, firstName: user.firstName, lastName: user.lastName, address: user.address, city: user.city, state: user.state, zipCode: user.zipCode, country: user.country, adminId:adminDeatils?._id });
        }else if (user.role === "Merchant") {
            merchantDeatils = await doGetMerchantByUserId(user._id, req, res);
            let businessDetails = await doGetBusinessByUserId(user?._id, req, res);
            console.log(businessDetails, "businessDetails");
            let businessNumber = businessDetails[0]?.businessNumber
            console.log(businessNumber, "businessNumber");
            const token = jwt.sign({id: user._id,userId:user._id,email: user.userEmail,role: user.role,phoneNumber: user.phoneNumber,firstName: user.firstName,lastName: user.lastName,address: user.address,city: user.city,state: user.state,zipCode: user.zipCode,country: user.country, merchantId:merchantDeatils?._id, merchantNumber: merchantDeatils?.merchantNumber,businessNumber: businessNumber}, process.env.JWT_SECRET, { expiresIn: "10hr" });
            return res.status(200).json({status:"Success", message:"user logged in successfully", token, userId: user._id, role: user.role, email: user.email, phoneNumber: user.phoneNumber, firstName: user.firstName, lastName: user.lastName, address: user.address, city: user.city, state: user.state, zipCode: user.zipCode, country: user.country, merchantId:merchantDeatils?._id, merchantNumber: merchantDeatils?.merchantNumber, businessNumber: businessNumber });

        }else {
            const token = jwt.sign({id: user._id,userId:user._id,email: user.userEmail,role: user.role,phoneNumber: user.phoneNumber,firstName: user.firstName,lastName: user.lastName,address: user.address,city: user.city,state: user.state,zipCode: user.zipCode,country: user.country }, process.env.JWT_SECRET, { expiresIn: "10hr" });
            return res.status(200).json({status:"Success", message:"user logged in successfully", token, userId: user._id, role: user.role, email: user.email, phoneNumber: user.phoneNumber, firstName: user.firstName, lastName: user.lastName, address: user.address, city: user.city, state: user.state, zipCode: user.zipCode, country: user.country });
        
        }

        

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};
// //Forgot password
// exports.ForgotPassword =  async (req, res) => {
//     const { email } = req.body
//     try {
//         const user = await userModel.findOne({ email })
//         if (!user) {
//              res.status(401).json("User does exists !!")

//         } else {
//             const secret = process.env.JWT_SECRET + user.password;
//             const token = jwt.sign({ email: user.email, id: user._id }, secret, {
//                 expiresIn: "10hr"
//             });

//             const link = `http://localhost:5000/api/auth/reset-password/${user._id}/${token}`;
//             var transporter = nodemailer.createTransport({
//                 service: "gmail",
//                 auth: {
//                     user: "elijahkungu100@gmail.com",
//                     pass: "yfppdwlgikaumbrd",
//                 },
//             });

//             var mailOptions = {
//                 from: "elijahkungu100@gmail.com",
//                 to: email,
//                 subject: "Password Reset",
//                 text: link,
//             };

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log("Email sent: " + info.response);
//                 }
//             });

//             console.log(link);
//          res.status(200).json({ link })
//         }

//     } catch (error) {
//          res.status(500).json({ message: error.message });

//     }



// };
// //reset passwword
// exports.getResetPassword =  async (req, res) => {
//     const { id, token } = req.params;
//     // res.send("DONE")
//     console.log(req.params);
//     const user = await User.findOne({ _id: id });
//     if (!user) {
//         return res.json({ status: "User Not Exists!!" });
//     }
//     const secret = process.env.JWT_SECRET + user.password;
//     try {
//         const verify = jwt.verify(token, secret);
//         return res.render("index", { email: verify.email, status: "Not Verified" });
//     } catch (error) {
//         console.log(error);
//         return  res.send("Not Verified");
//     }
// };
// exports.PostResetPassowrd =  async (req, res) => {
//     const { id, token } = req.params;
//     const { password } = req.body;

//     const user = await userModel.findOne({ _id: id });
//     if (!user) {
//          res.json({ status: "User Not Exists!!" });
//     }
//     const secret = process.env.JWT_SECRET + user.password;
//     try {
//         const verify = jwt.verify(token, secret);

//         const encryptedPassword = await crypto.AES.encrypt(password, process.env.PASS_SEC).toString()
//         await userModel.updateOne(
//             {
//                 _id: id,
//             },
//             {
//                 $set: {
//                     password: encryptedPassword,
//                 },
//             }
//         );


//      res.render("index", { email: verify.email, status: "verified" });
//         // res.json({ status: "Password Updated" });
//     } catch (error) {
//         console.log(error);
//          res.json({ status: "Something Went Wrong" });
//     }
// };





