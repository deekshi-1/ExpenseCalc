const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
  res.send("Expense Routes workes");
});


module.exports = router;