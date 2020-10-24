const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session')



//Routes
const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuarios');
const bicicletasRouter = require('./routes/bicicletas');
const bicicletasAPIRouter = require('./routes/api/bicicletas');
const usuariosAPIRouter = require('./routes/api/usuarios');
const tokenRouter = require('./routes/token');




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
app.use(session({
  cookie: {maxAge: 240 * 60 * 60 * 1000}, //time for cookie
  store: store,//we save in store
  saveUninitialized: true,
  resave: 'true',
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

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/bicicletas', bicicletasRouter);
app.use('/api/bicicletas', bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);



//Handle Routes from app.js
app.get('/login', (req, res)=>{
  res.render('session/login')
})

app.post('/login', (req, res, next)=> {
  //method of passport
  passport.authenticate('local', (err, user, info)=>{
    //if there is a error
    if(err) return next(err);
    //if there is not a user , we render login and pass info
    if(!usuario) return res.render('session/login', {info});
    req.logIn(usuario, err =>{
      if(err) return next(err);
      //if everthing is ok redirect to home
      return res.redirect('/');
    });
  }) (req, res, next);
})

app.get('/logout', (req, res)=>{
  req.logOut() //clean the session
  res.redirect('/')
})


app.get('/forgotPassword', (req, res)=>{
  res.render('session/forgotPassword')
})

app.post('/forgotPassword', (req, res)=>{
  Usuario.findOne({email: req.body.email}, (err, usuario)=>{
    if(!usuario) return res.render('session/forgotPassword', {info: {message: 'No existe la clave'}});
    
    usuario.resetPassword(err=>{
      if(err) return next(err);
      console.log('session/forgotPasswordMessage');
    })
    res.render('session/forgotPasswordMessage')
  })
})

app.get('/resetPassword/:token', (req, res, next)=>{
  Token.findOne({token: req.params.token}, (err, token)=>{
    if(!token) return res.status(400).send({type: 'not-verified', msg: 'No existe una clave así'})

    Usuario.findById(token._userId, (err, usuario)=>{
      if(!usuario) return res.status(400).send({msg: 'No existe un usuario asociado a este password'});
      res.render('session/resetPassword', {errors: {}, usuario: usuario})
    })
  })
})

app.post('/resetPassword', (req, res)=>{
  if(req.body.password != req.body.confirm_password) {
    res.render('session/resetPassword', {errors: {confirm_password: {message: 'No coinciden las contraseñas'}}});
    return;
  }
  Usuario.findOne({email: req.body.email}, (err, usuario)=>{
    usuario.password = req.body.password;
    usuario.save(err=>{
      if(err){
        res.render('session/resetPassword', {errors: err.errors, usuario: new Usuario});
      } else {
        res.redirect('/login')
      }
    })
  })
})
//end of handle routes from app.js






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
