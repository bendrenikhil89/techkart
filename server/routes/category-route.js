const express = require("express");
const router = express.Router();

const {authCheck, adminCheck} = require("../middleware/auth-middleware");
const {fetchAll, fetchOne, create, remove, update} = require("../controllers/category-controller");

router.get("/categories", fetchAll);
router.get("/category/:slug", fetchOne);
router.post("/category", authCheck, adminCheck, create);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.put("/category/:slug",authCheck, adminCheck, update );

module.exports = router;