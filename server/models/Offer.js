const mongoose = require("mongoose");

const OfferSchema = mongoose.Schema({
  entreprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entreprise",
    required: true,
  },

  job_title: { type: String, required: true },

  type: {
    type: String,
    enum: ["work", "internship"],
    required: true,
  },

  environment: {
    type: String,
    enum: ["On-site", "remote", "hybrid"],
    required: true,
  },

  time_type: {
    type: String,
    enum: ["Part-time", "Full-time"],
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  skills: {
    type: [String],
    default: [],
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

OfferSchema.virtual("requests", {
  ref: "Request",
  localField: "_id",
  foreignField: "offer",
});

module.exports = Offer = mongoose.model("offer", OfferSchema);
