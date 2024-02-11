const router = require('express').Router();
const userModel = require('../models/user')
// const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

const { doCreateUser } = require('../helperfunctions/auth');
exports.RegisterUser = async (req, res) => {
   const {firstName,secondName, userEmail,userPhone, password, type } = req.body;
   

    try {
        let userPhoneExist = await userModel.findOne({ userPhone });
        if(userPhoneExist) return res.status(400).json({error: `User with phonenumber  ${userPhone} already exists ...`});
        let userEmailExist = await userModel.findOne({ userEmail });
        if(userEmailExist) return res.status(400).json({error: `User with email ${userEmail} already exists ...`});

        const createUser = await doCreateUser(firstName,secondName, userEmail,userPhone, password ,req, res);
        res.status(200).json({ message: 'User created successfully', result: createUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


};

// exports.sendOtpCode = async (req, res) => {
// };
// //login user
// exports.LoginUser =  async (req, res) => {
//     try {
//         const user = await userModel.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(401).json({ message: 'Email not found kindly regsiter! ' });
//         }
//         const hashedpassword = crypto.AES.decrypt(user.password, process.env.PASS_SEC).toString(crypto.enc.Utf8);
//         if (hashedpassword !== req.body.password) {
//              return res.status(401).json({ message: 'Email and Password do not match' });
//         }
//         const { password, ...userWithoutPassword } = user.toObject();
//         const accessToken = jwt.sign({
//             user: user._id,
//             userEmail:user.email,
//             prefered_name:user.prefered_name,
//             phone_number:user.phone_number,
//             D_O_B:user.D_O_B,
//             gender:user.gender,
//             zodiacSign:user.zodiacSign,
//             find_in:user.find_in,
//             isAdmin: user.isAdmin
//         }, process.env.JWT_SECRET, { expiresIn: '10h' });
         
//         const text = "Login"
//         const prefered_name = user.prefered_name
//         const userIPAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
//         const city = req.city || "Not Found"

//         console.log('User IP Address:', userIPAddress, user.email, text, prefered_name, city);


//         await sendLoginNotification(user.email, text, prefered_name, userIPAddress, city)
//         let title = "Login";
//         let description = "Login to your account";
//         let country = "Kenya";
//         let location = "Nairobi";
//         let dateAndTime = Date.now();
//         let userId = user._id;
//         const ipaddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
//         await createActivity(title, description, city, country, location, dateAndTime, userId, ipaddress, res);

        

//         res.header("accesstoken", accessToken).json({
//             message: 'Auth successful',
//             //user: user
//             user: userWithoutPassword,
//             accessToken
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
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
//                 expiresIn: "1hr"
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





