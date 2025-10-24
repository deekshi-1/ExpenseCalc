const express = require("express");
const router = express.Router();
const auth = require("./auth.route");
const user = require("./user.route");
const category = require("./category.route");
const expense = require("./expense.route");

router.get("/", (req, res) => {
  res.send("Routes workes");
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/category", category);
router.use("/expense", expense);

module.exports = router;
