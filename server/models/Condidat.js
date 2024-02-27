const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CondidatSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: { type: String, required: true },

  adresse: { type: String },

  phone: {
    type: String,
  },
});

module.exports = Condidat = mongoose.model("condidat", CondidatSchema);
