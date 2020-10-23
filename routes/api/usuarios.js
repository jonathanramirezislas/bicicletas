const express = require('express');
const router = express.Router();
const usuarioControllerApi = require('../../controllers/api/usuarioControllerAPI');

router.get('/', usuarioControllerApi.usuarios_list)
router.post('/create', usuarioControllerApi.usuarios_create)
router.post('/reservar', usuarioControllerApi.usuario_reserva)
router.get('/:id/update', usuariosController.update_get);
router.post('/:id/update', usuariosController.update);
router.post('/:id/delete', usuariosController.delete);

module.exports = router