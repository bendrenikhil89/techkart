const express = require("express");
const router = express.Router();

const {authCheck} = require("../middleware/auth-middleware");
const {saveCart, getCart, addAddress, updatePassword, addToWishlist, getUserWishlist, removeFromWishlist, updateUserProfile} = require("../controllers/user-controller");

router.post("/user/cart", authCheck, saveCart);
router.post("/user/getcart", authCheck, getCart);
router.post("/user/address", authCheck, addAddress);
router.put("/user/updatepassword", authCheck, updatePassword);
router.put("/user/updateprofile", authCheck, updateUserProfile);

router.post("/user/addwishlist", authCheck, addToWishlist);
router.post("/user/wishlist", authCheck, getUserWishlist);
router.delete("/user/removewishlist", authCheck, removeFromWishlist);

module.exports = router;