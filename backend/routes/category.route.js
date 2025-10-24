const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Category Routes workes");
});


module.exports = router;