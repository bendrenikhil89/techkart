const express = require("express");
const router = express.Router();

const {authCheck, adminCheck} = require("../middleware/auth-middleware");
const {uploadBannerImages, removeBannerImage, fetchBannerImages} = require("../controllers/bannerImages-controller");

router.get("/bannerimages", fetchBannerImages)
router.post("/uploadbannerimage", authCheck, adminCheck, uploadBannerImages);
router.delete("/removebannerimage", authCheck, adminCheck, removeBannerImage);

module.exports = router;