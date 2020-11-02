const nodemailer = require("nodemailer");

const mailConfig = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user:  'bicicletajonas@gmail.com', // TODO: your gmail account
      pass:  'aguascalientes321' // TODO: your gmail password
  }
});

module.exports = nodemailer.createTransport(mailConfig)