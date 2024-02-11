const express = require('express')
const { RegisterUser, LoginUser, getResetPassword, PostResetPassowrd, ForgotPassword } = require('../controllers/auth')
const { sendVerificationCode, verifyOtpCode } = require('../helperfunctions/auth')


const autheticationRoutes = express.Router()
autheticationRoutes.post('/api/v1/swiftBuy/register',RegisterUser)
autheticationRoutes.post('/api/v1/swiftBuy/login', LoginUser)
// autheticationRoutes.get('/reset-password/:id/:token', getResetPassword)
// autheticationRoutes.post('/reset-password/:id/:token',PostResetPassowrd )
// autheticationRoutes.post('/forgotpassword',ForgotPassword )
autheticationRoutes.post('/api/v1/swiftBuy/sendVerification/otpCode',sendVerificationCode)
autheticationRoutes.post('/api/v1/swiftBuy/verify/otpCode',verifyOtpCode)



module.exports = autheticationRoutes