const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add an expense name"],
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please add a category"],
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
