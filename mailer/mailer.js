const nodemailer = require("nodemailer");

const mailConfig = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'thaddeus31@ethereal.email',
      pass: 'b9qmjtX2bHcxBVE6Sxk,jgb'
  }
});

module.exports = nodemailer.createTransport(mailConfig)