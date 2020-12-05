const Bicicleta = require('../../models/bicicleta')

exports.bicicleta_list = function (req, res) {
  Bicicleta.allBicis().exec((err, bicis) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.status(200).json({
      bicicletas: bicis
    })
  })

}

exports.bicicleta_create = function (req, res) {
  let bici = new Bicicleta({
    code: req.body.code,
    color: req.body.color,
    modelo: req.body.modelo,
    ubicacion: [req.body.lat, req.body.lng]
  });
  
  Bicicleta.add(bici)

  res.status(200).json({
    bicicleta: bici
  })
}

exports.bicicleta_delete = function (req, res) {
  Bicicleta.removeById(req.params.id)
  res.status(204).send();
}

exports.bicicleta_update_post = function (req, res) {
  let body = _.pick(req.body, ['color', 'modelo', 'code'])

  Bicicleta.findByIdAndUpdate(
    req.params.id,
    body, {
      new: true
    },
    (err, biciBD) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          error: {
            message: `No se encuentra una bicicleta con id: ${req.params.id}`,
            err
          }
        })
      }

      return res.status(200).json({
        bicicleta: biciBD
      })
    })

}