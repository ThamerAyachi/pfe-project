const Entreprise = require("../../models/Entreprise");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailController = require("./EmailController");

require("dotenv").config();

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  adresse: Joi.string().allow(""),
  phone: Joi.string().allow(""),
});

exports.register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const email = req.body.email.toLowerCase();

    const existingUser = await Entreprise.findOne({
      email: email,
    });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new Entreprise({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      adresse: req.body.adresse,
      phone: req.body.phone,
    });
    await user.save();

    await emailController.sendEmailVerified(req, email, user._id);

    res.status(201).json({ message: "Entreprise created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .json({ error: "Email and Password must be provided" });
  }

  const user = await Entreprise.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Email or Password is incorrect" });
  }

  const result = user.toObject();
  delete result.password;

  if (!!result.photo) {
    result.photo = `${req.protocol}:\/\/${req.get(
      "host"
    )}/file/entreprise-profile/${result.photo}`;
  }

  const token = jwt.sign(result, process.env.JWT_SECRET);

  return res.json({
    token: {
      access_token: token,
      type: "Bearer",
    },
    entreprise: { ...result },
  });
};
