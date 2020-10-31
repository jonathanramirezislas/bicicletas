const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');

passport.use(new LocalStrategy(
    (email, password, done)=>{
        //we search the user by his/her email
        Usuario.findOne({email: email}, (err, usuario)=>{
            //If there is a error
            if(err) return done(err)
            //If there is not user with that email
            if(!usuario) return done(null, false, {message: 'Email no existente o incorrecto'});
            //If password is not valid
            if (!usuario.validPassword(password)) return done(null, false, {message: 'Password no existente o incorrecto'});

            //Everthing is OK.
            return done(null, usuario)
        })
    }
));

//configuration of passport

//Passport here saved the id of the user
//cb(callback)
passport.serializeUser( (user,cb) => {
    cb(null, user.id);//first argument tells was not error and pass iD user for serialize
});

//Here pass from User.Id to object user (data of user not just id)
passport.deserializeUser((id, cb)=>{
    Usuario.findById(id, (err, usuario)=>{
        cb(err, usuario)
    });
});

module.exports = passport;