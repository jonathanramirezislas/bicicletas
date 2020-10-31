const createError = require('http-errors');
const express = require('express');//user authentication library
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session')
const jwt = require ('jsonwebtoken')

const Usuario = require('./models/usuario');
//const token = require('./models/token');


//Routes
const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuarios');
const bicicletasRouter = require('./routes/bicicletas');
const bicicletasAPIRouter = require('./routes/api/bicicletas');
const usuariosAPIRouter = require('./routes/api/usuarios');
const tokenRouter = require('./routes/token');
const authAPIRouter = require('./routes/api/auth');


app.use('/bicicletas', bicicletasRouter);
app.use('/api/bicicletas',validarUsuario, bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);

app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);
app.use('/bicicletas',loggedIn, bicicletasAPIRouter);
app.use('/api/bicicletas',validarUsuario, bicicletasAPIRouter);
app.use('/api/auth', authAPIRouter);
//THE SEED TO ENCRYPT
app.set('secretKey', 'jwt_pwd_!!223344')





const app = express();
const mongoose = require('mongoose');
//Conection to the DB
const mongoDB = process.env.MONGO_URI || 'mongodb://localhost/red_bicicletas';
mongoose.connect(mongoDB, {
  useCreateIndex: true,
  useUnifiedTopology:true,
  useNewUrlParser: true
});
//just set up
mongoose.Promise = global.Promise;
const db = mongoose.connection;
//in case of error conection
db.on('error', console.error.bind(console, 'MongoDB connection error: '));


//we save the session in the server (Note. If the server trun off the session is lost)
const store = new session.MemoryStore;

//package that needs passport for sessions

app.use(session({
  cookie: {maxAge: 240 * 60 * 60 * 1000}, //life time for cookie
  store: store,//we save in store
  saveUninitialized: true,
  resave: 'true',//in each request the session will be saved even if it was already saved
  secret: 'red_bicicletas_!!!%&/&____234234' //Here you can put anything that is used to encrypt the cookie
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


//Handle Routes from app.js
app.get('/login', (req, res)=>{
  res.render('session/login') //render the view view session/login
})


/*req will contain the data from body //arrow function
  passport.authenticate method of passport middleware 
req, res, next); execute
*/
app.post('/login', (req, res, next) =>{
  var usuario = req.body;
  passport.authenticate('local', (err, usuario, info)=> {  
    if (err) return next(err);
    if (!usuario) return res.render('session/login', {info});
    req.logIn(usuario, function (err) {  
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});


//clean the session
app.get('/logout', (req, res)=>{
  req.logOut() 
  res.redirect('/')
})

app.get('/forgotPassword', function(req,res) {
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', function(req,res) {
  Usuario.findOne({ email: req.body.email }, function(err, usuario) {
    if (!usuario) return res.render('session/forgotPassword', { info: { message: 'No existe el email para un usuario existente' } });
    
    usuario.resetPassword(function(err) {
      if (err) return next(err);
      console.log('session/forgotPasswordMessage');
    });
    
    res.render('session/forgotPasswordMessage');
  });
});

app.get('/resetPassword/:token', function(req, res, next) {
  console.log(req.params.token);
  token.findOne({ token: req.params.token }, function(err, token) {
    if(!token) return res.status(400).send({ msg: 'No existe un usuario asociado al token, verifique que su token no haya expirado' });
    Usuario.findById(token._userId, function(err, usuario) {
      if(!usuario) return res.status(400).send({ msg: 'No existe un usuario asociado al token.' });
      res.render('session/resetPassword', {errors: { }, usuario: usuario});
    });
  });
});

app.post('/resetPassword', function(req, res) {
  if(req.body.password != req.body.confirm_password) {
    res.render('session/resetPassword', {errors: {confirm_password: {message: 'No coincide con el password ingresado'}}, usuario: new Usuario({email: req.body.email})});
    return;
  }
  Usuario.findOne({email: req.body.email}, function(err, usuario) {
    usuario.password = req.body.password;
    usuario.save(function(err) {
      if(err) {
        res.render('session/resetPassword', {errors: err.errors, usuario: new Usuario({email: req.body.email})});
      } else {
        res.redirect('/login');
      }
    });
  });
});
//end of handle routes from app.js


function loggedIn(req, res, next) {
  if(req.user) {
    next();
  } else {
    console.log('User sin loguearse');
    res.redirect('/login');
  }
};

//validate user with JWT
function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      console.log('Error en validar Usuario');
      res.json({ status: "error", message: err.message, data: null });
    } else {
      console.log('Pasó el usuario: ' + req.body.userId);
     //WE GET THE ENCRYPTED ID
      req.body.userId = decoded.id;
      console.log('JWT verify: ' + decoded);
      next();
    }
  });
};





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// set locals, only providing error in development
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
