const express = require("express");
const router = express.Router();

const authController = require("../../controllers/condidat/AuthController");

const authMiddleware = require("../../middleware/condidat/authMiddleware");

router.get("/", authMiddleware.authenticate, authController.profile);

module.exports = router;
