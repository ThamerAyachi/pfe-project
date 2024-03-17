const Entreprise = require("../../models/Entreprise");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const fs = require("fs").promises;

exports.profile = async (req, res, next) => {
  return res.json(req.user);
};

const updateProfileSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  adresse: Joi.string(),
  phone: Joi.string(),
  webSite: Joi.string(),
  activity: Joi.string(),
});

exports.updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body, {
      stripUnknown: true,
    });

    if (error) {
      throw new Error("Invalid input data");
    }

    const existingUser = await Entreprise.findById(req.user._id);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (value.email && value.email !== existingUser.email) {
      const emailExists = await Entreprise.exists({ email: value.email });
      if (emailExists) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }

    Object.assign(existingUser, value);
    await existingUser.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(8),
});

exports.updatePassword = async (req, res, next) => {
  try {
    const { error, value } = updatePasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await Entreprise.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      value.oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(value.newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.saveProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await Entreprise.findById(req.user._id);

    if (!user) {
      await promisify(fs.unlink)(req.file.path);
      return res.status(404).json({ error: "User not found" });
    }

    user.photo = req.file.filename;
    await user.save();

    res.status(200).json({ message: "Profile photo uploaded successfully" });
  } catch (error) {
    next(error);
  }
};
