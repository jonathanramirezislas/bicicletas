
const express = require('express');
const router = express.Router();
const authControllerApi = require('../../controllers/api/authControllerAPI');

router.post('/authenticate', authControllerApi.authenticate);

module.exports = router;