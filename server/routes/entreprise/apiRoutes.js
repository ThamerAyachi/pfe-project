const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/entreprise/ProfileController");

const authMiddleware = require("../../middleware/entreprise/authMiddleware");
const multerMiddleware = require("../../middleware/entreprise/multerMiddleware");

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

module.exports = router;
