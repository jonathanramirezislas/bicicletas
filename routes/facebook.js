const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get("/", passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/callback',
  passport.authenticate('facebook', {
    successRedirect: '/bicicletas',
    failureRedirect: '/login'
  })
);

module.exports = router;