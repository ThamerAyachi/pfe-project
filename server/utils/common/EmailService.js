const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

exports.sendMail = async (to, subject, templateName, data) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../../views/emailTemplates",
      `${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, data);
    const mailOptions = {
      from: process.env.MAILER_EMAIL,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
