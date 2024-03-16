const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/condidat/ProfileController");

const authMiddleware = require("../../middleware/condidat/authMiddleware");

router.get("/", authMiddleware.authenticate, profileController.profile);

router.post("/", authMiddleware.authenticate, profileController.updateProfile);

router.post(
  "/update-password",
  authMiddleware.authenticate,
  profileController.updatePassword
);

module.exports = router;
