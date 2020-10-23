const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Schema OF Tooken
const TokenSchema = new Schema({
    //save the Id of User
  _userId: {
    type: mongoose.Schema.Types.ObjectId,//Makes a reference of collection (specif user)
    required: true,
    ref: "Usuario",//ref is use for moongose to build the model (user with its fields)
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 43200 //This token will delete after a period of time (43200 in this case)
  },
});

module.exports = mongoose.model("Token", TokenSchema);