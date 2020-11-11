const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Reserva = require('./reserva')
const crypto = require('crypto')
const Token = require('./token');
const bcrypt = require('bcrypt');
const mailer = require('../mailer/mailer');

const Schema = mongoose.Schema;
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
        default: false //the efault value will be faulse
      },
      googleId:String,
      facebookId:String
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
    
    //We save the Recerva
    reserva.save(cb);
}

//we add a method to send email
usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
  const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')})
  const email_destination = this.email;
  token.save((err) => {
    if ( err ) { return console.log(err.message)}
    const mailOptions = {
      from: 'no-reply@redbicicletas.com',
      to: email_destination,
      subject: 'Verificacion de cuenta',
      text: 'Hola,\n\n' 
      + 'Por favor, para verificar su cuenta haga click en este link: \n' 
      + 'http://localhost:3000'
      + '\/token/confirmation\/' + token.token + '\n'
    }

    mailer.sendMail(mailOptions, function(err){
      if( err ) { return console.log(err.message) } 
      console.log('Se ha enviado un email de bienvenida a: ' + email_destination)
    })
  })
}


usuarioSchema.methods.resetPassword =  function(cb){
  const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
  const email_destination = this.email;
   token.save(function (err) {
    if (err) {return cb(err)}
    const mailOptions = {
      from: 'bicicletajonas@gmail.com',
      to: email_destination,
      subject: 'Reseteo de password de cuenta',
      text: 'Hola,\n\n' 
      + 'Por favor, para resetar el password de su cuenta haga click en este link: \n' 
      + 'http://localhost:3000'
      + '\/resetPassword\/' + token.token + '\n'
    }
     mailer.sendMail(mailOptions, function(err){
      if( err ) { return cb(err) } 
      console.log('Se ha enviado un email para resetar el password a: ' + email_destination)
    })

    cb(null);

  })
}

//Method of AuthO Note contidition is the user
usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(
  condition,
  cb
) {
  const self = this;//is use to don't loose the ref to the user in the other callback
console.log("user",condition);

  self.findOne(
    {
      $or: [{ googleId: condition.id }, { email: condition.emails[0].value }],
    },
    (err, result) => {
      if (result) {// if user exist 
        cb(err, result);//execute the callback with the user
      } else { //success
        let values = {};
        values.id = condition.id;
        values.email = condition.emails[0].value;
        values.nombre = condition.displayName || "Sin nombre";
        values.verificado = true;
        values.password = condition.emails[0].value + "pass";// improve this 

        //we create the user
        self.create(values, (err, result) => {
          if (err) {
            console.log(err);
          }
          return cb(err, result);
        });
      }
    }
  );
}


usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition, callback) {
  const self = this;
  console.log("condition",condition);
  self.findOne({
      $or: [
          { 'facebookId': condition.id }, { 'email': condition.emails[0].value }
      ]
  }).then((result) => {
      if (result) {
          callback(null,result);
      } else {
          console.log('---------------- CONDITION ------------------');
          console.log(condition);
          var values = {}
          values.facebookId = condition.id;
          values.email = condition.emails[0].value;
          values.nombre = condition.displayName || 'SIN NOMBRE';
          values.verificado = true;
          values.password = crypto.randomBytes(16).toString('hex');
          console.log('---------------- VALUES----------------------');
          console.log(values);

          self.create(values)
              .then((result) => {
                  return callback(null,result);
              })
              .catch((err) => {
                console.log(err);
                return callback(err);
              })
      }
  }).catch((err) => {
      callback(err);
      console.error(err);
  })
}




module.exports = mongoose.model('Usuario', usuarioSchema);