const Usuario = require('../models/usuario');
const Token = require('../models/tokenModel');

module.exports = {
  confirmationGet: function (req, res, next) {

    //brig the user with the token
    Token.findOne({token: req.params.token}, function (err, token) {
     //If there is no token foun
      if (!token) return res.status(400).send({
        type: 'not-verified',
        msg: 'No encontramos un usuario con este token. Quizá haya expirado y debas solicitarlo nuevamente'
      })

        //If the token was found
      Usuario.findById(token._userId, function (err, usuario) {
     //if there is not a user
        if (!usuario) return res.status(400).send({
          msg: 'No encontramos un usuario con este token'
        })
        //if the user is verified
        if (usuario.verificado) return res.redirect('/usuarios')
        usuario.verificado = true;//we change the status of verified
        //we save the user  
        usuario.save((err) => {
          if (err) {
            return res.status(500).send({
              msg: err.message
            })
          }
          res.redirect('/');
        })
      })
    })
  }
}