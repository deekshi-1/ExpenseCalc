const Expense = require("../models/expense.model");
const Category = require("../models/category.model");

addExpense = async (req, res, next) => {
  try {
    const { name, paymentType, amount, date, expenseCategory, comment } =
      req.body;
    const cat = await Category.findOne({
      name: expenseCategory,
      user: req.user._id,
    });

    const expense = await Expense.create({
      user: req.user._id,
      name,
      paymentType,
      amount,
      date,
      category: cat._id,
      comment,
    });
    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(400);
    next(new Error(error.message || "Failed to add expense"));
  }
};

getExpense = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ user: userId })
      .populate("category")
      .sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(400);
    next(new Error(error.message || "Failed to fetch expenses"));
  }
};

getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ user: userId })
      .populate("category")
      .sort({ date: -1 });
    const totalAmount = await expenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const firstExpense = expenses[0];
    const lastExpense = expenses[expenses.length - 1];
    res.status(200).json({
      success: true,
      count: expenses.length,
      totalAmount,
      firstExpense,
      lastExpense,
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(400);
    next(new Error(error.message || "Failed to fetch expenses"));
  }
};

module.exports = {
  addExpense,
  getExpense,
  getDashboard,
};
