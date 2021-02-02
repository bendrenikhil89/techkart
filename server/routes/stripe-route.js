const express = require("express");
const router = express.Router();

const {authCheck} = require("../middleware/auth-middleware");
const { createPaymentIntent } = require("../controllers/stripe-controller");

router.post("/create-payment-intent", authCheck, createPaymentIntent);

module.exports = router;