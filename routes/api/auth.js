
const express = require('express');
const router = express.Router();
const authControllerApi = require('../../controllers/api/authControllerAPI');

router.post('/authenticate', authControllerApi.authenticate);
router.post('/forgotPassword', authControllerApi.forgotPassword);
router.post('/facebook_token', passport.authenticate('facebook-token'), authControllerApi.authFacebookToken);

module.exports = router;