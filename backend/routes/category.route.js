const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const categoryController = require("../controllers/category.controller");

router.get("/", (req, res) => {
  res.send("Category Routes workes");
});

router.route("/getCategory").get(auth, categoryController.getCategory);
router.route("/addCategory").post(auth, categoryController.addCategory);
router.route("/removeCategory/:id").delete(auth, categoryController.removeCategory);

module.exports = router;
