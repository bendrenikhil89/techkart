const express = require("express");
const router = express.Router();

const {authCheck, adminCheck} = require("../middleware/auth-middleware");
const {fetchAllSubCategories, createSubCategory, removeSubCategory, updateSubCategory, fetchLookupSubCategories} = require("../controllers/subcategory-controller");

router.get("/subcategories", fetchAllSubCategories);
router.post("/lookupsubcategories", fetchLookupSubCategories);
router.post("/subcategory", authCheck, adminCheck, createSubCategory);
router.delete("/subcategory/:slug", authCheck, adminCheck, removeSubCategory);
router.put("/subcategory/:slug",authCheck, adminCheck, updateSubCategory);

module.exports = router;