const Expense = require("../models/expense.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");

addExpense = async (req, res, next) => {
  try {
    const { name, paymentType, amount, date, expenseCategory, comment } =
      req.body;

    let cat = await Category.findOne({
      name: expenseCategory,
      user: req.user._id,
    });

    if (!cat) {
      cat = new Category({ name: expenseCategory, user: req.user._id });
      await cat.save();
      // Update user's categories array
      await User.findByIdAndUpdate(req.user._id, {
        $push: { categories: cat._id },
      });
    }

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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const [totalExpenses, expenses] = await Promise.all([
      Expense.countDocuments({ user: userId }),
      Expense.find({ user: userId })
        .populate("category")
        .sort({ date: -1 })
        .skip(skip)
        .limit(pageSize)
    ]);
    res.status(200).json({
      success: true,
      totalExpenses: totalExpenses,
      totalPages: Math.ceil(totalExpenses / pageSize),
      currentPage: page,
      countOnPage: expenses.length, // How many items are on this specific page
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
    const categoryTotals = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDoc"
        }
      },
      { $unwind: "$categoryDoc" },
      {
        $group: {
          _id: "$categoryDoc.name",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalAmount,
      firstExpense,
      lastExpense,
      categoryTotals,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(400);
    next(new Error(error.message || "Failed to fetch expenses"));
  }
};

getAnalyticsByCategory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const categoryTotals = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDoc"
        }
      },
      { $unwind: "$categoryDoc" },
      {
        $group: {
          _id: "$categoryDoc.name",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({
      success: true,
      categoryTotals
    });
  } catch (error) {
    console.error("Error fetching category analytics:", error);
    res.status(400);
    next(new Error(error.message || "Failed to fetch category analytics"));
  }
};

getAnalyticsByYear = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const yearFilter = req.query.year ? parseInt(req.query.year, 10) : undefined;

    const monthlyTotals = await Expense.aggregate([
      {
        $match: Object.assign(
          { user: userId },
          yearFilter ? { $expr: { $eq: [{ $year: "$date" }, yearFilter] } } : {}
        )
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
          label: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" }
                ]
              }
            ]
          }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);
    const yearsResult = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $year: "$date" }
        }
      },
      { $project: { _id: 0, year: "$_id" } },
      { $sort: { year: 1 } }
    ]);
    const uniqueYears = yearsResult.map(y => y.year);
    res.status(200).json({
      success: true,  
      monthlyTotals,
      uniqueYears
    });
  } catch (error) {
    console.error("Error fetching yearly analytics:", error);
    res.status(400);
    next(new Error(error.message || "Failed to fetch yearly analytics"));
  }
};

getExpenseById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const expenseId = req.params.id;

    const expense = await Expense.findOne({
      _id: expenseId,
      user: userId
    }).populate("category");

    if (!expense) {
      res.status(404);
      return next(new Error("Expense not found"));
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(400);
    next(new Error(error.message || "Failed to fetch expense"));
  }
};

updateExpense = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const expenseId = req.params.id;
    const { name, paymentType, amount, date, expenseCategory, comment } = req.body;

    const expense = await Expense.findOne({ _id: expenseId, user: userId });
    if (!expense) {
      res.status(404);
      return next(new Error("Expense not found"));
    }

    let categoryId = expense.category;
    if (expenseCategory) {
      const cat = await Category.findOne({ name: expenseCategory, user: userId });
      if (!cat) {
        res.status(400);
        return next(new Error("Invalid category"));
      }
      categoryId = cat._id;
    }

    expense.name = name ?? expense.name;
    expense.paymentType = paymentType ?? expense.paymentType;
    expense.amount = amount ?? expense.amount;
    expense.date = date ?? expense.date;
    expense.category = categoryId ?? expense.category;
    expense.comment = comment ?? expense.comment;

    const updated = await expense.save();
    const populated = await updated.populate("category");

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: populated,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(400);
    next(new Error(error.message || "Failed to update expense"));
  }
};

deleteExpense = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const expenseId = req.params.id;

    const deleted = await Expense.findOneAndDelete({ _id: expenseId, user: userId });
    if (!deleted) {
      res.status(404);
      return next(new Error("Expense not found"));
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(400);
    next(new Error(error.message || "Failed to delete expense"));
  }
};

module.exports = {
  addExpense,
  getExpense,
  getDashboard,
  getAnalyticsByCategory,
  getAnalyticsByYear,
  getExpenseById,
  updateExpense,
  deleteExpense
};
