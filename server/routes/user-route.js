const express = require("express");
const router = express.Router();

const {authCheck} = require("../middleware/auth-middleware");
const {saveCart, getCart, addAddress} = require("../controllers/user-controller");

router.post("/user/cart", authCheck, saveCart);
router.post("/user/getcart", authCheck, getCart);
router.post("/user/address", authCheck, addAddress);

module.exports = router;