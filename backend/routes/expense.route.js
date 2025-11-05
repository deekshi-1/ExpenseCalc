const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const auth = require("../middleware/authMiddleware");

router.route("/getExpense").get(auth, expenseController.getExpense);

router.route("/addExpense").post(auth, expenseController.addExpense);

module.exports = router;
