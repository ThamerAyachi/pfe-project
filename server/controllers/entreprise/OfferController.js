const Offer = require("../../models/Offer");
const Joi = require("joi");
const mongoose = require("mongoose");

const { BadRequestError, NotFoundError } = require("../../errors/index");

exports.getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({
      entreprise: new mongoose.Types.ObjectId(req.user._id),
    });

    return res.status(200).json(offers);
  } catch (error) {
    console.log("Error in getOffers", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in get Offers" });
  }
};

const offerRequirement = Joi.object({
  job_title: Joi.string().required(),
  type: Joi.string().valid("work", "internship").required(),
  environment: Joi.string().valid("On-site", "remote", "hybrid").required(),
  time_type: Joi.string().valid("Part-time", "Full-time").required(),
  description: Joi.string().required(),
  skills: Joi.array().items(Joi.string()).default([]),
});

exports.createOffer = async (req, res, next) => {
  try {
    const { error } = offerRequirement.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const newOffer = new Offer({
      ...req.body,
      entreprise: new mongoose.Types.ObjectId(req.user._id),
    });
    const savedOffer = await newOffer.save();

    return res.status(201).json(savedOffer);
  } catch (error) {
    console.log("Error in createOffer", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in create Offer" });
  }
};

const updateOfferRequirement = Joi.object({
  job_title: Joi.string(),
  type: Joi.string().valid("work", "internship"),
  environment: Joi.string().valid("On-site", "remote", "hybrid"),
  time_type: Joi.string().valid("Part-time", "Full-time"),
  description: Joi.string(),
  skills: Joi.array().items(Joi.string()),
});

exports.updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error, value } = updateOfferRequirement.validate(req.body);

    if (error) {
      throw new BadRequestError("Invalid input data");
    }

    const existingOffer = await Offer.findOne({
      _id: new mongoose.Types.ObjectId(id),
      entreprise: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!existingOffer) {
      throw new NotFoundError("Offer not found");
    }

    Object.assign(existingOffer, value);
    await existingOffer.save();

    return res.status(200).json({ message: "Offer updated successfully" });
  } catch (error) {
    console.log("Error in updateOffer", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in update Offer" });
  }
};

exports.deleteOffer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findOne({
      _id: new mongoose.Types.ObjectId(id),
      entreprise: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!offer) {
      throw new NotFoundError("Offer not found");
    }

    await Offer.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
      entreprise: new mongoose.Types.ObjectId(req.user._id),
    });

    return res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.log("Error in deleteOffer", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in delete Offer" });
  }
};
