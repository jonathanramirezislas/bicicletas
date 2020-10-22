var mongoose = require('mongoose')
var Bicicleta = require('../../models/bicicleta')
var Reserva = require('../../models/reserva');
var Usuario = require('../../models/usuario');
// var {Usuario, Reserva} = require('../../models/usuario')

 //remeber beforeEach afterEach are call before and after of Test

describe('Testing Usuarios', function () {

  beforeEach(function (done) {
    var mongoDB = 'mongodb://localhost/testdb'
    mongoose.connect(mongoDB, {
      useNewUrlParser: true
    })

    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error'))
    db.once('open', function () {
      console.log('We are connected to test database')
      done()
    })
  })

 //Note here we can use Promises
//cascada to delete all dependencies
  afterEach(function (done) {
                          //callback
    Reserva.deleteMany({}, function (err, success) {
      if (err) console.log(err)
      Usuario.deleteMany({}, function (err, success) {
        if (err) console.log(err);
        Bicicleta.deleteMany({}, (err, success) => {
          if (err) console.log(err);
          done()
        })
      })
    })
  })

  //Test
  describe('Cuando un Usuario reserva una bici', () => {
    it('debe existir la reserva', (done) => {
      //Create a user
      const usuario = new Usuario({
        nombre: 'Prueba',
        email: 'test@test.com',
        password: '123456'
      })
      usuario.save()

      //Create a bicycle
      const bicicleta = new Bicicleta({
        code: 1,
        color: "verde",
        modelo: "deportiva"
      })
      bicicleta.save();
  
      //dates for booking (reserve)
      var hoy = new Date();
      var mañana = new Date();
      mañana.setDate(hoy.getDate() + 1)
      
      //We book a bicycle                        //callback
      usuario.reservar(bicicleta.id, hoy, mañana, (err, reserva) => {
 
        //promises instead use cascade
        //Explanation
        /*
        Reserva.find({}) returns a object that contains populate method (populate('bicicleta'))
        this return another object contains populate method populate('usuario')
        finally we 3 object has the exect method exec this one receives a callback
        */
        Reserva.find({}).populate('bicicleta').populate('usuario').exec((err, reservas) => {
          console.log(reservas[0]);
          
          //result that we expect
          expect(reservas.length).toBe(1)
          expect(reservas[0].diasDeReserva()).toBe(2)
          expect(reservas[0].bicicleta.code).toBe(1)
          expect(reservas[0].usuario.nombre).toBe(usuario.nombre)
          done()

        })
      })
    })
  })
})

/*
**Notes
Mongoose has a more powerful alternative called populate() , 
which lets you reference documents in other collections.

*/
