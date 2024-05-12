const Request = require("../../models/Request");
const Offer = require("../../models/Offer");
const Joi = require("joi");
const mongoose = require("mongoose");

const { BadRequestError, NotFoundError } = require("../../errors/index");

const requestRequirement = Joi.object({
  offer: Joi.string().required(),
  resume: Joi.string().required(),
});

exports.createRequest = async (req, res, next) => {
  try {
    const { error, value } = requestRequirement.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const newRequest = new Request({
      condidat: new mongoose.Types.ObjectId(req.user._id),
      offer: new mongoose.Types.ObjectId(value.offer),
      resume: new mongoose.Types.ObjectId(value.resume),
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json(savedRequest);
  } catch (error) {
    console.log("Error in createRequest", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in create Request" });
  }
};
