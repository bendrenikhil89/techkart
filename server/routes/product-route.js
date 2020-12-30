const express = require("express");
const router = express.Router();

const {authCheck, adminCheck} = require("../middleware/auth-middleware");
const {createProduct, updateProduct, removeProduct,fetchProduct, fetchAllProducts} = require("../controllers/product-controller");

router.get("/product/:slug", fetchProduct);
router.get("/products", fetchAllProducts);
router.post("/product", authCheck, adminCheck, createProduct);
router.put("/product/:slug", authCheck, adminCheck, updateProduct);
router.delete("/product/:slug", authCheck, adminCheck, removeProduct);

module.exports = router;