const Usuario = require('../../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: function(req, res, next){
        Usuario.findOne({ email: req.body.email}, function(err, userInfo){
            if(err){
                next(err);
            }else{
                if(userInfo === null){ return res.status(401).json({status:"error", message: "invalido email/password", data: null}); }
                if(userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)){
                    userInfo.save(function(err, usuario){
                        const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), { expiresIn: '7d' });
                        res.status(200).json({message: "Usuario encontrado", data: {usuario: usuario, token: token}});
                    });
                }else{
                    res.status(401).json({status: "error", message: "Invalido email/password", data: null});
                }
            }
        })
    },
    forgotPassword: function(req, res, next){
        Usuario.findOne({ email: req.body.email }, function(err, usuario){
            if(!usuario) return res.status(401).json({ message: "No existe el usuario", data: null});
            usuario.resetPassword(function(err){
                if(err){ return next(err); }
                res.status(200).json({message: "Se envio un email para reestablecer el password", data: null});
            });
        });
    },
//
    authFacebookToken: function (req, res, next) {
        if (req.user) {
          req.user.save().then(() => {
            const token = jwt.sign({id: req.user.id},
                req.app.get('secretKey'), 
                {expiresIn: '7d'
                }
            );
            res.status(200).json({
              message: "Usuario encontrado o creado",
              data: {
                user: req.user,
                token
              }
            })
          }).catch((err) => {
            console.log(err)
            res.status(500).json({
              message: err.messae
            })
          })
        } else {
          res.status(401);
        }
      }
    
}