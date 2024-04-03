const Condidat = require("../../models/Condidat");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const emailService = require("../../utils/common/EmailService");
const { BadRequestError, NotFoundError } = require("../../errors/index");

require("dotenv").config();

const invalidatedTokens = [];

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Condidat.findOne({ email });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.FRONT_URL}/set_password/?token=${token}`;

    await emailService.sendMail(email, "Password reset", "forgetPassword", {
      resetLink,
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in forgotPassword" });
  }
};

const invalidateToken = (token) => {
  invalidatedTokens.push(token);
};

exports.checkTokenRestPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    if (!token) {
      throw new BadRequestError("Token is missing");
    }

    if (invalidatedTokens.includes(token)) {
      return res.status(400).json({ error: "Token has already been used" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({ message: "Token valid" });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.log("Token expired");
      return res.status(400).json({ error: "Token expired" });
    } else {
      console.log("Error in 'Check token password': ", err);
      return res.status(400).json({ error: "Invalid token" });
    }
  }
};

const resetPassword = Joi.object({
  password: Joi.string().min(8),
});

exports.resetPassword = async (req, res, next) => {
  const token = req.params.token;
  const { password } = req.body;
  try {
    if (!token || !password) {
      throw new BadRequestError("Token and new password are required");
    }

    if (invalidatedTokens.includes(token)) {
      return res.status(400).json({ error: "Token has already been used" });
    }

    const { error } = resetPassword.validate(req.body);
    if (error) {
      throw new BadRequestError(error);
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Condidat.findOne({ _id: decode.userId.toString() });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    invalidateToken(token);

    return res.status(200).json({ message: "Password Reseated" });
  } catch (error) {
    console.error("Error in resetPassword: ", error);
    if (err instanceof jwt.TokenExpiredError) {
      console.log("Token expired");
      return res.status(400).json({ error: "Token expired" });
    } else
      return res
        .status(error.status ?? 400)
        .json({ error: error.message ?? "Error in resetPassword" });
  }
};

exports.sendEmailVerified = async (req, email, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/condidat/email-verified/${token}`;

    await emailService.sendMail(
      email,
      "Email Verification",
      "emailVerification",
      { verificationLink }
    );
  } catch (err) {
    console.error("Error in send email verified:", err);
    throw new BadRequestError("Error in send email verified");
  }
};

exports.verifiedEmail = async (req, res, next) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Condidat.findOne({ _id: decoded.userId });

    if (!user) {
      throw new NotFoundError("User Not found");
    }
    user.emailVerified = true;
    await user.save();
    const filePath = path.join(
      __dirname,
      "../../views/html",
      "verificationSuccess.html"
    );
    return res.sendFile(filePath);
  } catch (err) {
    console.log("Error in verified email: ", err);
    const filePath = path.join(
      __dirname,
      "../../views/html",
      "verificationFailure.html"
    );
    return res.sendFile(filePath);
  }
};

exports.resendEmailVerification = async (req, res, nex) => {
  try {
    if (req.user?.emailVerified == true) {
      return res.status(400).json({ error: "Email already verified" });
    }
    await this.sendEmailVerified(req, req.user.email, req.user._id);
    return res
      .status(200)
      .json({ message: "Email Verification send successfully" });
  } catch (err) {
    console.log("Error in resend email verification: ", err);
    return res
      .status(400)
      .json({ error: "Error in resend email verification" });
  }
};
