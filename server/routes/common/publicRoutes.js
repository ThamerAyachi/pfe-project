const express = require("express");
const router = express.Router();

const publicController = require("../../controllers/common/publicController");

router.get("/file/:directories/:filename", publicController.getImages);

module.exports = router;
