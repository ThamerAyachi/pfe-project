const Condidat = require("../../models/Condidat");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailController = require("./EmailController");

require("dotenv").config();

const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
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

    const existingUser = await Condidat.findOne({
      email: email,
    });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new Condidat({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: email,
      password: hashedPassword,
      adresse: req.body.adresse,
      phone: req.body.phone,
    });
    await user.save();

    await emailController.sendEmailVerified(req, email, user._id);

    res.status(201).json({ message: "Condidat created successfully" });
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

  const user = await Condidat.findOne({ email: email.toLowerCase() });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Email or Password is incorrect" });
  }

  const result = user.toObject();

  delete result.password;

  if (!!result.photo) {
    result.photo = `${req.protocol}:\/\/${req.get(
      "host"
    )}/file/condidat-profile/${result.photo}`;
  }

  const token = jwt.sign({ ...result }, process.env.JWT_SECRET);

  return res.json({
    token: {
      access_token: token,
      type: "Bearer",
    },
    condidat: { ...result },
  });
};
