const mongoose = require("mongoose");

const ResumeSchema = mongoose.Schema({
  condidat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Condidat",
    require: true,
  },

  name: { type: String, require: true },

  path: { type: String, require: true },

  content: { type: Object },
});

module.exports = Resume = mongoose.model("resume", ResumeSchema);
