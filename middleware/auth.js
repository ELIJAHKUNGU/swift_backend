const jwt = require('jsonwebtoken');
const { checkOriginCalling } = require('../utils/checkCountry');
require('dotenv').config({
    path : '.env'
})

const Secret = process.env.JWT_SECRET

exports.userAuth = async (req , res , next) => {
    const token = req.header("X-Authorization")

    if (!token) {
        return res.status(401).json({
            Status : 'FAILED' , status: "01" , message : 'No token provided.'
        })
    }

    try {
        req.id = await jwt.verify(token , Secret);
        next();
         await checkOriginCalling(req, res, next);
    } catch (err) {
        return res.status(401).json({
            Status : 'FAILED' , status: "01", message : 'Invalid token.' , error : err.message
        })
    }

}