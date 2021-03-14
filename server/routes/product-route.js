const express = require("express");
const router = express.Router();

const {authCheck, adminCheck} = require("../middleware/auth-middleware");
const {createProduct, updateProduct, removeProduct,fetchProduct, fetchAllProducts, fetchProductsByPageSize, postRating, searchFilters, fetchProductsByCategory, productsCount, fetchBrands} = require("../controllers/product-controller");

router.get("/product/:slug", fetchProduct);
router.get("/products/:count", fetchAllProducts);
router.post("/products", fetchProductsByPageSize);
router.post("/product", authCheck, adminCheck, createProduct);
router.put("/product/:slug", authCheck, adminCheck, updateProduct);
router.put("/product/star/:productId", authCheck, postRating);
router.delete("/product/:slug", authCheck, adminCheck, removeProduct);
router.post("/search/filters", searchFilters);
router.post("/productsByCategory", fetchProductsByCategory);
router.post("/productscount", productsCount);
router.get("/productsbrand", fetchBrands);

module.exports = router;