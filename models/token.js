const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/*
Schema OF Tooken

ref: "Usuario",//ref is use for moongose to build the model (user with its fields)
   type: mongoose.Schema.Types.ObjectId,//Makes a reference of collection (specif user)
  save the Id of User
This token will delete after a period of time (43200 in this case)
*/
const TokenSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 43200 
  },
});

module.exports = mongoose.model("Token", TokenSchema);