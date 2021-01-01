const express = require("express");
const router = express.Router();

const {signUp, login, confirmEmail, resendLink, validateToken, resetPassword, forgotPassword} = require("../controllers/auth-controller");

router.post("/signup", signUp);
router.post("/login", login);
router.get("/confirmation/:email/:token",confirmEmail);
router.post("/resendlink", resendLink);
router.get("/validateuser", validateToken);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:email/:token",resetPassword);

module.exports = router;