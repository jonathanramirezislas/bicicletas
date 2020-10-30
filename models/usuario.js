var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;
//const transporter = require('../mailer/mailer');
const Token = require('./token');
const uniqueValidator = require('mongoose-unique-validator');
let crypto = require('crypto');
const nodemailer = require('nodemailer');

const mailer = require('../mailer/mailer');


const bcrypt = require('bcrypt');
const saltRounds = 10;/*this allows us to encrypt more securely
                        this stands for two users with the same passowrd the ecryption will be different
                        */

//regularExpresion
const validateEmail = function (email) {
    const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    return regExp.test(email);
  }
//Modelo Usuario Scehma 
var usuarioSchema = new Schema({
    nombre: {
        type:String,
        trim:true,
        required:[true,'El nombre es obligatorio']
    },
    email:{
        type:String,
        trim:true,
        required:[true,'El email es obligatorio'],
        lowercase: true,
        unique:true,
        validate: [validateEmail, 'Por favor ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/] //valdate in part of moongo
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
      },
      passwordResetToken: String,
      passwordResetTokenExpires: Date, //Expires of token
      verificado: {
        type: Boolean,
        default: false //the default value will be false
      }
    });

/*we add  plugins to add a new properties 
in this case a Unique Value (mongooese doesn't have a define propertie for unique values)

{PATH} will show the email
*/
usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario '});




    /*this helps to call a function before action('save')
    is executed
    */
usuarioSchema.pre('save', function(next){
    //if the password changed we will encrypt the password
    if ( this.isModified('password') ){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next(); //next helps to continue with the pending action ('save')
    });
      
    //validate the password compare the two passowrd input and saved
usuarioSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
    }



//cb stands for callback
//We add a method called resrvar
usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb){
  //instance of Reserva
    var reserva = new Reserva({
        usuario: this._id,
        bicicleta: biciId, 
        desde: desde, 
        hasta: hasta
    });
    
    //We save the Reserv
    reserva.save(cb);
}


usuarioSchema.methods.enviar_email_bienvenida =  function () {
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') })
    const email_destination = this.email;
     //sendemail(111);

      token.save(function (err) {
        if (err) {
            return console.log(err.message);
        }
        return console.log("Sent  it");
    });
    
}


usuarioSchema.methods.resetPassword = (cb) =>{
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    //sendemail(111);
    token.save(function(err) {
        if (err) { return cb(err); }
    
        cb(null);
    });
 
}


function sendemail(token){
// Step 1
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:  'bicicletajonas@gmail.com', // TODO: your gmail account
        pass:  'aguascalientes321' // TODO: your gmail password
    }
});

// Step 2
const mailOptions = {
    from: 'bicicletajonas@gmail.com', // TODO: email sender
    to: 'mogwamo@gmail.com', // TODO: email receiver
    subject: 'Nodemailer - Test',
    text: 'Wooohooo it works!!'
};

// Step 3
transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
         console.log('Error occurs',err);
    }
    console.log('Email sent!!!');
});

}


module.exports = mongoose.model('Usuario', usuarioSchema);