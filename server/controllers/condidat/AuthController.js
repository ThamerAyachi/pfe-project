const Condidat = require("../../models/Condidat");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
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

    const existingUser = await Condidat.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new Condidat({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      adresse: req.body.adresse,
      phone: req.body.phone,
    });
    await user.save();

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

  const user = await Condidat.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Email or Password is incorrect" });
  }

  const result = user.toObject();

  delete result.password;

  const token = jwt.sign({ ...result }, process.env.JWT_SECRET);

  return res.json({
    token: {
      access_token: token,
      type: "Bearer",
    },
    condidat: { ...result },
  });
};

exports.profile = async (req, res, next) => {
  return res.json(req.user);
};
