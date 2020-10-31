var Usuario = require('../models/usuario');

module.exports = {
  //  List we extract all Users
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

  //We get the user by its Id. 
  update_get: function (req, res, next) {
    //pass the id to the function findByiD(Mongo) & cllback
    //err is empty we pass this paaram because in the View is needed.
    Usuario.findById(req.params.id, (err, usuario) => {
      //We render the View and pass the params
      res.render('usuarios/update', {
        errors: {},
        usuario: usuario
      })
    })
  },

 //Update a User
/*findByIdAndUpdate (operation mongo)
we pass the id the user taht we want to update and the new values
*/
  update: function (req, res, next) {
    var update_values = { nombre: req.body.nombre};
    Usuario.findByIdAndUpdate(req.params.id, update_values, (err, usuario) => {
      //if there is a error we render the View with a error
      if (err) {
        console.log(err);
        res.render('usuarios/update', {
          errors: err.errors,
          usuario
        })
      } else {
        //If everthing is Ok we render to users
        res.redirect('/usuarios');
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
    //If the two password are not equals set the error
    if (req.body.password != req.body.confirm_password) {
      //we render the View with the error
      res.render('usuarios/create', {
        errors: {
          confirm_password: {
            message: 'No conciden las contraseñas'
          }
        },
        //We return back the user that he wanted add (was not add)
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
        //we send a email of welcom 
     //   nuevoUsuario.enviar_email_bienvenida(); //CREATE A ERROR
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