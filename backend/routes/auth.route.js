const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/", (req, res) => {
  res.send("Auth Routes workes");
});

router.route("/login").post(authController.checkLogin);
router.route("/signup").post(authController.signUpUser);

module.exports = router;
