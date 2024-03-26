const mongoose = require("mongoose");

const CondidatSchema = mongoose.Schema({
  photo: { type: String },

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

  emailVerified: { type: Boolean, default: false },

  password: { type: String, required: true },

  adresse: { type: String },

  phone: {
    type: String,
  },
});

module.exports = Condidat = mongoose.model("condidat", CondidatSchema);
