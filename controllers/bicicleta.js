var Bicicleta =require('../models/bicicleta');

exports.bicicleta_list = function (req, res) {
  Bicicleta.allBicis().exec((err, bicis) => {
      res.render('bicicletas/index', {bicis});
  })
  
}
exports.bicicleta_create_get = function (req, res) {
  res.render('bicicletas/create');
}

exports.bicicleta_create_post =function(req, res){
    var bici= new Bicicleta(
    {
        code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat || 0, req.body.lng || 0]
      }
      );
    Bicicleta.create(bici);
    Bicicleta.add(bici);
    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function (req, res) {
  Bicicleta.removeById(req.body.id);
  res.redirect('/bicicletas');
}

exports.bicicleta_update_get = function (req, res) {
  console.log("req.params", req.params)
  Bicicleta.findById(req.params.id).exec((err, bici) => {
    res.render('bicicletas/create', {
      bici
    });
  })
}
exports.bicicleta_update_post = function (req, res) {
  let body = _.pick(req.body, ['color', 'modelo', 'code'])
  body.ubicacion = [];
  if(req.body.lat){
    body.ubicacion[0] = req.body.lat;
  }
  if(req.body.lng){
    body.ubicacion[1] = req.body.lng;
  }

  Bicicleta.findByIdAndUpdate(
    req.params.id,
    body, {
      new: true
    },
    (err, biciBD) => {
      return res.redirect('/bicicletas');
    })
  
}

