const nodemailer = require('nodemailer');

module.exports.transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'cffmrfeedback@gmail.com',
        pass: 'pass'
    }
});



