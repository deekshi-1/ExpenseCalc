const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/", (req, res) => {
  res.send("User Routes workes");
});

router.route("/signup").post(authController.signUpUser);
router.route("/login").post(authController.checkLogin);

module.exports = router;
