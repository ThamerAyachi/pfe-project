const mongoose = require("mongoose");

const RequestSchema = mongoose.Schema({
  condidat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "condidat",
    required: true,
  },

  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    required: true,
  },

  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "resume",
    required: true,
  },
});

module.exports = Request = mongoose.model("Request", RequestSchema);
