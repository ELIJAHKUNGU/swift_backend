const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');
const dotenv = require("dotenv").config({
    path: ".env"
});

const senderAddress = process.env.EMAIL;
const senderPass = process.env.EMAIL_PASS;
let config = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
}


exports.doSendOtpCode = async (userEmail, otpCode, userName) => {
    let subject = "Your SWiftBuy verification code";

    let transporter = nodemailer.createTransport(config);
    let mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            logo: 'https://raw.githubusercontent.com/ELIJAHKUNGU/bnpl/development_branch/src/components/homeComponent/swiftAsset/logo1%404x%201.png?token=GHSAT0AAAAAACNDUPDMY5HQG27EI55RXLMCZNUZTWA',
            name: 'SWiftBuy',
            link: "http://swiftbuy.io/"
        }
    });
    let emailBody = {
        body: {
            name: `${userName}`,
            intro: `Please use the verification code below to verify your SwiftBuy code:  <span style="color: #3130C6;">${otpCode}</span>`,  
            outro: "If you have any questions or require further assistance, please don't hesitate to reach out to us.",
        }
    };
    let emailTemplate = mailGenerator.generate(emailBody);
    let message = {
        from:senderAddress,
        to: userEmail,
        subject: subject,
        html: emailTemplate
    };
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);

        }
    }
    );
}