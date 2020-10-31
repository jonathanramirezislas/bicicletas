

const nodemailer = require('nodemailer');

const mailConfig = {
     host: 'smtp.ethereal.email',
     port: 587,
     auth: {
      ser:  'bicicletajonas@gmail.com', // TODO: your gmail account
      pass:  'aguascalientes321' // TODO: your gmail password
  }
};

module.exports = nodemailer.createTransport(mailConfig);

