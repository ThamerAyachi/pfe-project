const mongoose = require("mongoose");

const EntrepriseSchema = mongoose.Schema({
  photo: { type: String },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  adresse: {
    type: String,
  },

  webSite: {
    type: String,
  },

  activity: {
    type: String,
  },
});

module.exports = Entreprise = mongoose.model("entreprise", EntrepriseSchema);
