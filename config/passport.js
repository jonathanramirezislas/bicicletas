const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');


passport.use(new LocalStrategy(
    (email, password, done)=>{
        //we search the user by his/her email
        Usuario.findOne({email: email}, (err, usuario)=>{
            //If there is a error
            if(err) return done(err)
            //If there is not user with taht email
            if(!usuario) return done(null, false, {message: 'Email no existente o incorrecto'});
            //Is password is not valid
            if (!usuario.validPassword(password)) return done(null, false, {message: 'Password no existente o incorrecto'});

            //Everthing is OK. Execute the callaback
            return done(null, usuario)
        })
    }
));

//cb(callback)
passport.serializeUser(cb => {
    cb(null, usuario.id);
});

passport.deserializeUser((id, cb)=>{
    Usuario.findById(id, (err, usuario)=>{
        cb(err, usuario)
    });
});

module.exports = passport;