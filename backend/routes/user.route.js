const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require('../middleware/authMiddleware')

router.get("/", (req, res) => {
  res.send("User Routes workes");
});


router.route("/getData").get(auth, userController.getUserDetails);
router.route("/upDate").patch(auth, userController.updateUserDetails);
router.route("/logout").get(auth, userController.logoutUser);
router.route("/checkLogin").get(auth, userController.checkLogin);


module.exports = router;
