const express = require("express");
const router = express.Router();


const { authCheck } = require("../middleware/auth-middleware");
const { createOrder, fetchAllOrders } = require("../controllers/order-controller");

router.post("/order/confirm", authCheck, createOrder);
router.post("/orders/all", authCheck, fetchAllOrders);

module.exports = router;