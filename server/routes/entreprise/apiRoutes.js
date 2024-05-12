const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/entreprise/ProfileController");
const emailController = require("../../controllers/entreprise/EmailController");
const offerController = require("../../controllers/entreprise/OfferController");

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

router.get("/email-verified/:token", emailController.verifiedEmail);

router.post(
  "/email-verified",
  authMiddleware.authenticate,
  emailController.resendEmailVerification
);

router.post("/rest-password", emailController.forgetPassword);

router.get("/rest-password/:token", emailController.checkTokenRestPassword);

router.post("/rest-password/:token", emailController.resetPassword);

router.get("/offer", authMiddleware.authenticate, offerController.getOffers);

router.get(
  "/offer/:id",
  authMiddleware.authenticate,
  offerController.getOfferRequests
);

router.post("/offer", authMiddleware.authenticate, offerController.createOffer);

router.post(
  "/offer/:id",
  authMiddleware.authenticate,
  offerController.updateOffer
);

router.delete(
  "/offer/:id",
  authMiddleware.authenticate,
  offerController.deleteOffer
);

module.exports = router;
