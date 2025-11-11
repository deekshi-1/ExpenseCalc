const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const auth = require("../middleware/authMiddleware");

router.route("/getExpense/:id").get(auth, expenseController.getExpenseById);
router.route("/getExpense").get(auth, expenseController.getExpense);
router.route("/dashboard").get(auth, expenseController.getDashboard);
router.route("/analytics/categories").get(auth, expenseController.getAnalyticsByCategory);
router.route("/analytics/yearly").get(auth, expenseController.getAnalyticsByYear);

router.route("/addExpense").post(auth, expenseController.addExpense);

router.route("/updateExpense/:id").put(auth, expenseController.updateExpense);
router.route("/deleteExpense/:id").delete(auth, expenseController.deleteExpense);

module.exports = router;
