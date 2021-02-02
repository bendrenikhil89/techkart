const express = require("express");
const router = express.Router();


const { authCheck } = require("../middleware/auth-middleware");
const { createOrder } = require("../controllers/order-controller");

router.post("/order/confirm", authCheck, createOrder);

module.exports = router;