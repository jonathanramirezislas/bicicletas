var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: String,
})

//cb stands for callback
//We add a method called resrvar
usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb){
  //instance of Reserva
    var reserva = new Reserva({
        usuario: this._id,
        bicicleta: biciId, 
        desde: desde, 
        hasta: hasta
    });
    
    //We save the Recerva
    reserva.save(cb);
}

module.exports = mongoose.model('Usuario', usuarioSchema);