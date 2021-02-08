const express = require("express");
const router = express.Router();


const { authCheck, adminCheck } = require("../middleware/auth-middleware");
const { createOrder, fetchAllOrdersForUser , fetchAllOrders, updateOrder } = require("../controllers/order-controller");

router.post("/order/confirm", authCheck, createOrder);
router.post("/orders/all", authCheck, fetchAllOrdersForUser);
router.post("/admin/orders/all", authCheck, adminCheck, fetchAllOrders);

router.put("/admin/updateorder", authCheck, adminCheck, updateOrder);

module.exports = router;