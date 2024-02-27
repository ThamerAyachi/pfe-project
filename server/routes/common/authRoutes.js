const express = require("express");
const router = express.Router();
const condidatAuthController = require("../../controllers/condidat/AuthController");
const entrepriseAuthController = require("../../controllers/entreprise/AuthController");

router.post("/condidat/register", condidatAuthController.register);
router.post("/condidat/login", condidatAuthController.login);

router.post("/entreprise/register", entrepriseAuthController.register);
router.post("/entreprise/login", entrepriseAuthController.login);

module.exports = router;
