var Usuario = require('../models/usuario');

module.exports = {
  list: function (req, res, next) {
    Usuario.find({}, (err, usuarios) => {
      let data = {
        usuarios: []
      }
      if (usuarios.length > 0) {
        data.usuarios = usuarios
      }
      console.log(data)
      res.render('usuarios/index', data)
    })
  },
  update_get: function (req, res, next) {
    Usuario.findById(req.params.id, (err, usuario) => {
      res.render('usuario/update', {
        errors: {},
        usuario
      })
    })
  },
  update: function (req, res, next) {
    var update_values = {
      nombre: req.body.nombre
    };
    Usuario.findByIdAndUpdate(req.params.id, update_values, {
      new: true
    }, (err, usuario) => {
      if (err) {
        console.log(err);
        res.render('usuarios/update', {
          errors: err.errors,
          usuario
        })
      } else {
        res.redirect('usuarios');
        return;
      }
    })
  },
  create_get: function (req, res, next) {
    res.render('usuarios/create', {
      errors: {},
      usuario: new Usuario()
    });
  },
  create: function (req, res, next) {
    if (req.body.password != req.body.confirm_password) {
      res.render('usuarios/create', {
        errors: {
          confirm_password: {
            message: 'No conciden las contraseñas'
          }
        },
        usuario: new Usuario({
          nombre: req.body.nombre,
          email: req.body.email
        })
      })
      return
    }
    Usuario.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password: req.body.password
    }, (err, nuevoUsuario) => {
      if (err) {
        res.render('usuarios/create', {
          errors: err.errors,
          usuario: new Usuario()
        })
      } else {
        nuevoUsuario.enviar_email_bienvenida();
        res.redirect('/usuarios');
      }
    })
  },
  delete: function (req, res, next) {
    Usuario.findByIdAndDelete(req.body.id, (err) => {
      if (err) {
        next(err);
      } else {
        res.redirect('/usuarios')
      }
    })
  }
}