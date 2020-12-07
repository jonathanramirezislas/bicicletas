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
      console.log("bici a añadir",bici);
    Bicicleta.add(bici);
    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function (req, res) {
  Bicicleta.findByIdAndDelete(req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.redirect('/bicicletas');
    }
  });
 
}

exports.bicicleta_update_get = function (req, res) {
  console.log("req.params", req.params)
  Bicicleta.findById(req.params.id).exec((err, bici) => {
    res.render('bicicletas/update', {
      bici
    });
  })
}

exports.bicicleta_update_post = function(req,res){
  var update_values = { 
      color : req.body.color,
      modelo: req.body.modelo,
      ubicacion : [req.body.lat, req.body.lng]
  };
  Bicicleta.findByIdAndUpdate(req.params.id, update_values,
    (err, bicicleta) => {
    //if there is a error we render the View with a error
    if (err) {
      console.log(err);
      res.render('bicicletas/update', {
        errors: err.errors,
        bicicleta
      })
    } else {
      //If everthing is Ok we render to bicicletas
      res.redirect('/bicicletas');
      return;
    }
  })
}





