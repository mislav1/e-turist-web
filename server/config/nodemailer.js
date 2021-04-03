const nodemailer = require('nodemailer')
require('dotenv').config();

const { EMAIL_USER, EMAIL_PASS } = process.env

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
})

module.exports = { transporter }