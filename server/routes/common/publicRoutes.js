const express = require("express");
const router = express.Router();

const publicController = require("../../controllers/common/publicController");
const offerController = require("../../controllers/common/offerController");

router.get("/file/:directories/:filename", publicController.getImages);
router.get("/offer", offerController.getOffers);

module.exports = router;
