var express = require('express');
var router = express.Router();
var bicicletaController= require('../../controllers/api/bicicletaControllerAPI');

router.get('/', bicicletaController.bicicleta_list);
router.post('/', bicicletaController.bicicleta_create);
router.delete('/', bicicletaController.bicicleta_delete);

module.exports=router;
