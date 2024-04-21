const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/condidat/ProfileController");
const emailController = require("../../controllers/condidat/EmailController");
const resumeController = require("../../controllers/condidat/ResumeController");

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

router.post("/rest-password", emailController.forgetPassword);

router.get("/rest-password/:token", emailController.checkTokenRestPassword);

router.post("/rest-password/:token", emailController.resetPassword);

router.post(
  "/resume",
  authMiddleware.authenticate,
  multerMiddleware.uploadResume.single("resume"),
  resumeController.uploadResume
);

router.get("/resume", authMiddleware.authenticate, resumeController.getResumes);
router.delete(
  "/resume/:id",
  authMiddleware.authenticate,
  resumeController.deleteResume
);

module.exports = router;
