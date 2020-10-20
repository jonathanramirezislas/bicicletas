var Usuario = require('../../models/usuario')

exports.usuarios_list = (req, res) => {
  Usuario.find({}, (err, usuarios) => {
    res.status(200).json({
      usuarios
    })
  })
}

exports.usuarios_create = (req, res) => {
  var usuario = new Usuario({
    nombre: req.body.nombre
  })

  usuario.save((err) => {
    res.status(200).json(usuario)
  })
}

exports.usuario_reserva = (req, res) => {
  Usuario.fìndById(req.body.id, (er, usuario) => {
    console.log(usuario);
    usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta, (err) => {
      console.log('Reserva!!!!');
      res.status(200).send();
    })
  })
}