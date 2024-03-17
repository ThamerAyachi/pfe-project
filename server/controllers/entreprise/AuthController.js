const Entreprise = require("../../models/Entreprise");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    const existingUser = await Entreprise.findOne({
      email: req.body.email,
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

  const userObject = user.toObject();
  delete userObject.password;

  const token = jwt.sign(userObject, process.env.JWT_SECRET);

  return res.json({
    token: {
      access_token: token,
      type: "Bearer",
    },
    entreprise: { ...userObject },
  });
};

exports.profile = async (req, res, next) => {
  return res.json(req.user);
};
