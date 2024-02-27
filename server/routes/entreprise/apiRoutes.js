const express = require("express");
const router = express.Router();

const authController = require("../../controllers/entreprise/AuthController");

const authMiddleware = require("../../middleware/entreprise/authMiddleware");

router.get("/", authMiddleware.authenticate, authController.profile);

module.exports = router;
