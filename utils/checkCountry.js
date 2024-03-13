const geoip = require('geoip-lite');
exports.checkOriginCalling = async (req, res, next) => {
    try {
        var ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        if (ipAddress.includes(",")) {
            ipAddress = ipAddress.split(",")
            ipAddress = ipAddress[0]
        }
        console.log(`Source ip address  ... ${ipAddress} `)
        // Get location information
        const location = geoip.lookup(ipAddress);
        console.log(`location `, location)
        let country = location?.country
        // Print location details
        console.log('IP Address:', ipAddress);
        console.log('Country:', location?.country);
        console.log('Region:', location?.region);
        console.log('City:', location?.city);
        let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        addLog({
            ipAddress,
            country: country,
            region: location?.region,
            url: fullUrl,
            city: location?.city,
            comments: "logging",
            businessId: req?.id?.bid,
            userId: req?.id?.id,
        })

        // if (process.env.APP_ENV != "production") {
        //     next()
        // } else {

        //     if (!process.env.ALLOWEDCOUNTRIES.includes(country)) {
        //         return res.status(400).json({ status: false, message: "You are not authorized to perform this operation" })
        //     } else {
        //         next()
        //     }
        // }
        next()
    } catch (err) {
        console.log(`err `, err)
        return res.status(400).json({ status: false, message: "You are not authorized to perform this operation" })
    }


}

exports.addLog = async (data) => {
    console.log(`logging ...`, data)
}