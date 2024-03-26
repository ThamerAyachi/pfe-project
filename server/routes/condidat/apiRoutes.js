const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/condidat/ProfileController");
const emailController = require("../../controllers/condidat/EmailController");

const authMiddleware = require("../../middleware/condidat/authMiddleware");
const multerMiddleware = require("../../middleware/condidat/multerMiddleware");

router.get("/", authMiddleware.authenticate, profileController.profile);

router.post("/", authMiddleware.authenticate, profileController.updateProfile);

router.post(
  "/update-password",
  authMiddleware.authenticate,
  profileController.updatePassword
);

router.post(
  "/picture",
  authMiddleware.authenticate,
  multerMiddleware.uploadProfilePicture.single("photo"),
  profileController.saveProfilePicture
);

router.get("/email-verified/:token", emailController.verifiedEmail);

router.post(
  "/email-verified",
  authMiddleware.authenticate,
  emailController.resendEmailVerification
);

module.exports = router;
