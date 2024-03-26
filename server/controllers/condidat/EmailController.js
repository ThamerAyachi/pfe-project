const Condidat = require("../../models/Condidat");
const jwt = require("jsonwebtoken");
const path = require("path");

const emailService = require("../../utils/common/EmailService");
const { BadRequestError, NotFoundError } = require("../../errors/index");

require("dotenv").config();

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = Condidat.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/condidat/reset-password/${token}`;

    await emailService.sendMail(email, "Password reset", "forgetPassword", {
      resetLink,
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    throw new BadRequestError("Error in forgotPassword");
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
    throw new BadRequestError("Error in resend email verification");
  }
};
