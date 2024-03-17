const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/entreprise/ProfileController");

const authMiddleware = require("../../middleware/entreprise/authMiddleware");

router.get("/", authMiddleware.authenticate, profileController.profile);

router.post("/", authMiddleware.authenticate, profileController.updateProfile);

router.post(
  "/update-password",
  authMiddleware.authenticate,
  profileController.updatePassword
);

module.exports = router;
