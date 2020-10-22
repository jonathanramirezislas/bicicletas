var mongoose = require('mongoose');
var moment = require('moment');//allows to work with dates
var Schema = mongoose.Schema;

//Reserva Shema 
var reservaSchema = new Schema({
  desde: Date,
  hasta: Date,
  //referncia al objecto de reserva
  bicicleta: {
    type: mongoose.Schema.Types.ObjectId,
    //ref = Model's name
    ref: 'Bicicleta'
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
})

//We add a method called diasDeReserva
reservaSchema.methods.diasDeReserva = function () {
  return moment(this.hasta).diff(moment(this.desde), 'days') + 1
}

module.exports = mongoose.model('Reserva', reservaSchema)