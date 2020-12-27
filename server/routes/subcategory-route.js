const express = require("express");
const router = express.Router();

const {authCheck, adminCheck} = require("../middleware/auth-middleware");
const {fetchAllSubCategories, createSubCategory, removeSubCategory, updateSubCategory} = require("../controllers/subcategory-controller");

router.get("/subcategories", fetchAllSubCategories);
router.post("/subcategory", authCheck, adminCheck, createSubCategory);
router.delete("/subcategory/:slug", authCheck, adminCheck, removeSubCategory);
router.put("/subcategory/:slug",authCheck, adminCheck, updateSubCategory);

module.exports = router;